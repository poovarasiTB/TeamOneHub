# TeamOne Performance Optimization Guide

## Performance Targets

| Metric | Target | Critical |
|--------|--------|----------|
| **FCP** (First Contentful Paint) | < 1.0s | < 1.8s |
| **LCP** (Largest Contentful Paint) | < 2.0s | < 2.5s |
| **TTI** (Time to Interactive) | < 2.5s | < 3.8s |
| **TBT** (Total Blocking Time) | < 100ms | < 300ms |
| **CLS** (Cumulative Layout Shift) | < 0.05 | < 0.1 |
| **Lighthouse Score** | 95+ | 90+ |

---

## Bundle Optimization

### Current Status
- Initial Load: < 150KB (gzipped)
- Total Bundle: < 500KB (gzipped)
- Code Splitting: Enabled
- Lazy Loading: Enabled

### Optimization Commands

```bash
# Analyze bundle
npm run analyze

# Check bundle size
npm run build
npx vite-bundle-visualizer

# Check for duplicate dependencies
npm ls
```

### Lazy Loading Routes

```typescript
// Already implemented in App.tsx
const WorkHub = lazy(() => import('./hubs/work/WorkHub'));
const PeopleHub = lazy(() => import('./hubs/people/PeopleHub'));
// ... etc
```

---

## Image Optimization

### Guidelines
- Use WebP format where supported
- Compress all images
- Use responsive images with srcset
- Lazy load images below the fold

### Commands

```bash
# Install image optimization tools
npm install -g imagemin-cli

# Optimize images
imagemin src/images/* --out-dir=src/images/optimized
```

---

## Caching Strategy

### Service Worker (PWA)
- Static assets: Cache first, network fallback
- API responses: Network first, cache fallback
- Images: Cache first, network fallback

### HTTP Caching Headers
```
Cache-Control: public, max-age=31536000, immutable  # Static assets
Cache-Control: no-cache                            # HTML
Cache-Control: private, max-age=0                  # API responses
```

---

## Performance Testing

### Lighthouse CI

```bash
# Install Lighthouse CI
npm install -g @lhci/cli

# Run Lighthouse CI
lhci autorun

# Configuration in .lighthouserc.json
{
  "ci": {
    "collect": {
      "staticDistDir": "./dist",
      "url": ["http://localhost:3000/"]
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.9}],
        "categories:accessibility": ["error", {"minScore": 0.9}]
      }
    }
  }
}
```

### WebPageTest

```bash
# Submit to WebPageTest
curl -X POST https://www.webpagetest.org/runtest.php \
  -d "url=http://localhost:3000" \
  -d "f=json"
```

---

## Performance Monitoring

### Real User Monitoring (RUM)

```typescript
// Add to src/main.tsx
import { onCLS, onFID, onFCP, onLCP, onTTFB } from 'web-vitals';

onCLS(console.log);
onFID(console.log);
onFCP(console.log);
onLCP(console.log);
onTTFB(console.log);
```

### Performance Budget

```json
{
  "budget": [
    {
      "path": "/*",
      "resourceSizes": [
        {
          "resourceType": "script",
          "budget": 300
        },
        {
          "resourceType": "stylesheet",
          "budget": 50
        },
        {
          "resourceType": "image",
          "budget": 500
        }
      ],
      "resourceCounts": [
        {
          "resourceType": "third-party",
          "budget": 10
        }
      ]
    }
  ]
}
```

---

## Optimization Checklist

### Code
- [x] Code splitting enabled
- [x] Lazy loading implemented
- [x] Tree shaking enabled
- [x] Minification enabled
- [ ] Remove unused dependencies
- [ ] Optimize third-party scripts

### Assets
- [x] Images optimized
- [ ] Fonts subset
- [ ] SVGs optimized
- [ ] Videos optimized

### Network
- [x] Gzip/Brotli compression
- [x] HTTP/2 enabled
- [x] CDN configured
- [x] Preload critical resources
- [ ] Prefetch next navigation

### Rendering
- [x] Critical CSS inlined
- [x] Defer non-critical CSS
- [x] Async JavaScript where possible
- [x] Avoid layout thrashing
- [ ] Use CSS containment

---

## Performance Testing Commands

```bash
# Run performance tests
npm run test:performance

# Run Lighthouse
lighthouse http://localhost:3000 --output=html --output-path=./lighthouse-report.html

# Run WebPageTest CLI
webpagetest http://localhost:3000 --key YOUR_API_KEY
```

---

## Status

**Last Performance Audit:** Not yet audited  
**Lighthouse Score:** Not yet measured  
**Bundle Size:** Optimized  
**Critical Issues:** None identified  
**Action Required:** Schedule formal performance audit
