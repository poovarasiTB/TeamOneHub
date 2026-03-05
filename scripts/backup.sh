#!/bin/bash

# ═══════════════════════════════════════════════════════════════════
# TeamOne Automated Backup Script
# ═══════════════════════════════════════════════════════════════════
#
# This script performs automated backups of:
# - PostgreSQL databases
# - MinIO/S3 objects
# - Configuration files
# - Docker volumes
#
# Usage:
#   ./backup.sh [full|database|files|restore]
#
# ═══════════════════════════════════════════════════════════════════

set -e

# Configuration
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30
RETENTION_WEEKS=8
RETENTION_MONTHS=12

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1" >&2
}

warn() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1"
}

# Create backup directory
mkdir -p ${BACKUP_DIR}/{database,minio,config,volumes}

# ═══════════════════════════════════════════════════════════════════
# Database Backup
# ═══════════════════════════════════════════════════════════════════
backup_database() {
    log "Starting PostgreSQL backup..."
    
    BACKUP_FILE="${BACKUP_DIR}/database/teamone_${DATE}.sql.gz"
    
    docker-compose exec -T postgres pg_dump \
        -U teamone \
        -d teamone \
        --format=custom \
        --compress=9 \
        --verbose \
        | gzip > ${BACKUP_FILE}
    
    if [ $? -eq 0 ]; then
        BACKUP_SIZE=$(du -h ${BACKUP_FILE} | cut -f1)
        log "Database backup completed: ${BACKUP_FILE} (${BACKUP_SIZE})"
        
        # Verify backup integrity
        log "Verifying backup integrity..."
        if gunzip -t ${BACKUP_FILE}; then
            log "Backup integrity verified ✓"
        else
            error "Backup integrity check failed!"
            exit 1
        fi
    else
        error "Database backup failed!"
        exit 1
    fi
}

# ═══════════════════════════════════════════════════════════════════
# MinIO/S3 Backup
# ═══════════════════════════════════════════════════════════════════
backup_minio() {
    log "Starting MinIO backup..."
    
    BACKUP_FILE="${BACKUP_DIR}/minio/teamone_${DATE}.tar.gz"
    
    docker-compose exec -T minio mc cp -r \
        teamone-files/ \
        /backups/minio/teamone-files_${DATE}/
    
    if [ $? -eq 0 ]; then
        BACKUP_SIZE=$(du -sh ${BACKUP_DIR}/minio/teamone-files_${DATE}/ | cut -f1)
        log "MinIO backup completed: ${BACKUP_SIZE}"
    else
        warn "MinIO backup failed or skipped"
    fi
}

# ═══════════════════════════════════════════════════════════════════
# Configuration Backup
# ═══════════════════════════════════════════════════════════════════
backup_config() {
    log "Starting configuration backup..."
    
    CONFIG_BACKUP="${BACKUP_DIR}/config/teamone_config_${DATE}.tar.gz"
    
    tar -czf ${CONFIG_BACKUP} \
        docker-compose.yml \
        docker-compose.prod.yml \
        .env.production \
        monitoring/ \
        kubernetes/ \
        2>/dev/null || true
    
    if [ $? -eq 0 ]; then
        log "Configuration backup completed: ${CONFIG_BACKUP}"
    else
        warn "Configuration backup failed or skipped"
    fi
}

# ═══════════════════════════════════════════════════════════════════
# Docker Volumes Backup
# ═══════════════════════════════════════════════════════════════════
backup_volumes() {
    log "Starting Docker volumes backup..."
    
    VOLUMES=("postgres-data" "redis-data" "minio-data" "grafana-data")
    
    for volume in "${VOLUMES[@]}"; do
        BACKUP_FILE="${BACKUP_DIR}/volumes/${volume}_${DATE}.tar.gz"
        
        docker run --rm \
            -v ${volume}:/data:ro \
            -v ${BACKUP_DIR}/volumes:/backup \
            alpine \
            tar -czf /backup/$(basename ${volume})_${DATE}.tar.gz -C /data .
        
        if [ $? -eq 0 ]; then
            log "Volume ${volume} backup completed"
        else
            warn "Volume ${volume} backup failed"
        fi
    done
}

# ═══════════════════════════════════════════════════════════════════
# Upload to S3 (Optional)
# ═══════════════════════════════════════════════════════════════════
upload_to_s3() {
    if [ -n "${S3_BUCKET}" ] && [ -n "${AWS_ACCESS_KEY_ID}" ]; then
        log "Uploading backups to S3..."
        
        aws s3 sync ${BACKUP_DIR}/ s3://${S3_BUCKET}/teamone-backups/ \
            --storage-class STANDARD_IA \
            --exclude "*" \
            --include "*.sql.gz" \
            --include "*.tar.gz"
        
        if [ $? -eq 0 ]; then
            log "S3 upload completed"
        else
            warn "S3 upload failed"
        fi
    else
        warn "S3 backup skipped (credentials not configured)"
    fi
}

# ═══════════════════════════════════════════════════════════════════
# Cleanup Old Backups
# ═══════════════════════════════════════════════════════════════════
cleanup_old_backups() {
    log "Cleaning up old backups..."
    
    # Daily backups (keep for RETENTION_DAYS)
    find ${BACKUP_DIR}/database -name "*.sql.gz" -mtime +${RETENTION_DAYS} -delete
    find ${BACKUP_DIR}/minio -name "*.tar.gz" -mtime +${RETENTION_DAYS} -delete
    
    # Weekly backups (keep for RETENTION_WEEKS)
    find ${BACKUP_DIR}/volumes -name "*.tar.gz" -mtime +$((RETENTION_WEEKS * 7)) -delete
    
    # Monthly backups (keep for RETENTION_MONTHS)
    find ${BACKUP_DIR}/config -name "*.tar.gz" -mtime +$((RETENTION_MONTHS * 30)) -delete
    
    log "Cleanup completed"
}

# ═══════════════════════════════════════════════════════════════════
# Restore Database
# ═══════════════════════════════════════════════════════════════════
restore_database() {
    BACKUP_FILE=$1
    
    if [ -z "${BACKUP_FILE}" ]; then
        # Find latest backup
        BACKUP_FILE=$(ls -t ${BACKUP_DIR}/database/*.sql.gz | head -1)
    fi
    
    if [ ! -f "${BACKUP_FILE}" ]; then
        error "Backup file not found: ${BACKUP_FILE}"
        exit 1
    fi
    
    log "Restoring database from ${BACKUP_FILE}..."
    
    # Stop application containers
    log "Stopping application containers..."
    docker-compose stop api-gateway auth-service work-service money-service assets-service support-service growth-service
    
    # Restore database
    gunzip -c ${BACKUP_FILE} | docker-compose exec -T postgres pg_restore \
        -U teamone \
        -d teamone \
        --clean \
        --if-exists \
        --verbose
    
    if [ $? -eq 0 ]; then
        log "Database restore completed ✓"
        
        # Restart application containers
        log "Restarting application containers..."
        docker-compose start api-gateway auth-service work-service money-service assets-service support-service growth-service
        
        log "All services restarted"
    else
        error "Database restore failed!"
        exit 1
    fi
}

# ═══════════════════════════════════════════════════════════════════
# Send Notification
# ═══════════════════════════════════════════════════════════════════
send_notification() {
    STATUS=$1
    MESSAGE=$2
    
    if [ -n "${SLACK_WEBHOOK_URL}" ]; then
        if [ "${STATUS}" = "success" ]; then
            COLOR="good"
            EMOJI="✅"
        else
            COLOR="danger"
            EMOJI="❌"
        fi
        
        curl -X POST -H 'Content-type: application/json' \
            --data "{
                \"attachments\": [{
                    \"color\": \"${COLOR}\",
                    \"title\": \"${EMOJI} TeamOne Backup ${STATUS}\",
                    \"text\": \"${MESSAGE}\",
                    \"footer\": \"TeamOne Backup System\",
                    \"ts\": $(date +%s)
                }]
            }" \
            ${SLACK_WEBHOOK_URL}
    fi
    
    if [ -n "${ALERT_EMAIL}" ]; then
        echo "${MESSAGE}" | mail -s "TeamOne Backup ${STATUS}" ${ALERT_EMAIL}
    fi
}

# ═══════════════════════════════════════════════════════════════════
# Main Execution
# ═══════════════════════════════════════════════════════════════════
main() {
    case "${1:-full}" in
        full)
            log "Starting full backup..."
            backup_database
            backup_minio
            backup_config
            backup_volumes
            upload_to_s3
            cleanup_old_backups
            send_notification "success" "Full backup completed successfully"
            ;;
        database)
            backup_database
            send_notification "success" "Database backup completed successfully"
            ;;
        files)
            backup_minio
            backup_config
            backup_volumes
            send_notification "success" "File backup completed successfully"
            ;;
        restore)
            restore_database "$2"
            ;;
        cleanup)
            cleanup_old_backups
            ;;
        *)
            echo "Usage: $0 {full|database|files|restore [backup_file]|cleanup}"
            exit 1
            ;;
    esac
}

# Run main function
main "$@"
