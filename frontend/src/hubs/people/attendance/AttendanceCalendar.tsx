import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Badge } from '../../../components/Badge';
import { usePeopleStore } from '../../../store/peopleStore';
import { useAuthStore } from '../../../store/authStore';
import toast from 'react-hot-toast';

export function AttendanceCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { user } = useAuthStore();
  const { attendanceRecords, fetchAttendance, isLoading } = usePeopleStore();

  useEffect(() => {
    if (user?.id) {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      fetchAttendance({
        employeeId: user.id,
        startDate: `${year}-${month}-01`,
        endDate: `${year}-${month}-31`,
      });
    }
  }, [selectedDate, user?.id, fetchAttendance]);

  const attendanceMap = (attendanceRecords || []).reduce((acc, curr) => {
    const dateStr = curr.date.split('T')[0];
    acc[dateStr] = curr.status;
    return acc;
  }, {} as Record<string, string>);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'success';
      case 'late': return 'warning';
      case 'absent': return 'error';
      case 'half-day': return 'info';
      case 'work-from-home': return 'info';
      default: return 'default';
    }
  };

  const handleMarkAttendance = async (dateStr: string) => {
    if (!user?.id) {
      toast.error('You must be logged in');
      return;
    }

    try {
      const currentStatus = attendanceMap[dateStr];
      const newStatus = currentStatus === 'present' ? 'absent' : 'present';

      await markAttendance({
        employeeId: user.id,
        date: dateStr,
        status: newStatus,
        checkIn: currentStatus !== 'present' ? new Date().toISOString() : undefined
      });

      // Local state is updated by the store, but we can refetch too if needed
      toast.success('Attendance updated successfully');
    } catch (err) {
      // Error handled by store
    }
  };

  const daysInMonth = getDaysInMonth(selectedDate);
  const monthName = selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-text-100">Attendance Calendar</h1>
        <p className="text-text-400 mt-1">Track and manage your attendance</p>
      </div>

      {isLoading && (
        <div className="flex justify-center mb-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      )}

      {/* Month Navigation */}
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="secondary"
          onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1))}
        >
          ← Previous
        </Button>
        <h2 className="text-xl font-semibold text-text-100">{monthName}</h2>
        <Button
          variant="secondary"
          onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1))}
        >
          Next →
        </Button>
      </div>

      {/* Legend */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Badge variant="success">Present</Badge>
              <span className="text-text-400 text-sm">Present</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="warning">Late</Badge>
              <span className="text-text-400 text-sm">Late</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="error">Absent</Badge>
              <span className="text-text-400 text-sm">Absent</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="info">Leave/WFH</Badge>
              <span className="text-text-400 text-sm">Other</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="p-0">
          <div className="grid grid-cols-7 gap-px bg-border-12">
            {/* Day Headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="bg-bg-800 p-4 text-center text-sm font-semibold text-text-400">
                {day}
              </div>
            ))}

            {/* Calendar Days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i + 1);
              const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
              const status = attendanceMap[dateStr];
              const isToday = dateStr === new Date().toISOString().split('T')[0];
              const isWeekend = date.getDay() === 0 || date.getDay() === 6;

              return (
                <div
                  key={i}
                  onClick={() => !isWeekend && handleMarkAttendance(dateStr)}
                  className={`min-h-[100px] p-4 bg-surface-800 cursor-pointer hover:bg-surface-750 transition-colors ${isToday ? 'ring-2 ring-primary-500' : ''
                    } ${isWeekend ? 'opacity-50' : ''}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-sm font-medium ${isToday ? 'text-primary-400' : 'text-text-600'}`}>
                      {i + 1}
                    </span>
                    {status && (
                      <Badge variant={getStatusColor(status)} size="sm">
                        {status}
                      </Badge>
                    )}
                  </div>
                  {isWeekend && (
                    <p className="text-xs text-text-400">Weekend</p>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-text-400 mb-2">Present</p>
            <p className="text-3xl font-bold text-success">
              {Object.values(attendanceMap).filter(s => s === 'present').length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-text-400 mb-2">Late</p>
            <p className="text-3xl font-bold text-warning">
              {Object.values(attendanceMap).filter(s => s === 'late').length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-text-400 mb-2">Absent</p>
            <p className="text-3xl font-bold text-error">
              {Object.values(attendanceMap).filter(s => s === 'absent').length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-text-400 mb-2">Attendance Rate</p>
            <p className="text-3xl font-bold text-primary-400">
              {Math.round((Object.values(attendanceMap).filter(s => s === 'present').length / (Object.keys(attendanceMap).length || 1)) * 100)}%
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
