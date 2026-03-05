import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Badge } from '../../../components/Badge';
import { useMeetingStore, Meeting } from '../../../store/meetingStore';

export function MeetingsCalendar() {
  const { meetings, fetchMeetings, createMeeting, isLoading, error } = useMeetingStore();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showNewMeeting, setShowNewMeeting] = useState(false);
  const [newMeeting, setNewMeeting] = useState<Partial<Meeting>>({
    title: '',
    meetingType: 'team',
    startTime: '',
    endTime: '',
    locationType: 'video',
    status: 'scheduled',
  });

  useEffect(() => {
    fetchMeetings();
  }, []);

  const getDayMeetings = (date: Date) => {
    return meetings.filter((meeting) => {
      const meetingDate = new Date(meeting.startTime);
      return meetingDate.toDateString() === date.toDateString();
    });
  };

  const handleCreateMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMeeting(newMeeting as Partial<Meeting>);
      setShowNewMeeting(false);
      setNewMeeting({ title: '', meetingType: 'team', startTime: '', endTime: '', locationType: 'video', status: 'scheduled' });
    } catch (err) {
      console.error('Failed to create meeting:', err);
    }
  };

  const dayMeetings = getDayMeetings(selectedDate);

  const meetingTypeColors: Record<string, string> = {
    'one-on-one': 'bg-primary-500/20 text-primary-400 border-primary-500',
    team: 'bg-info/20 text-info border-info',
    client: 'bg-success/20 text-success border-success',
    interview: 'bg-warning/20 text-warning border-warning',
    other: 'bg-bg-600 text-text-400 border-bg-500',
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-text-100">Meetings Calendar</h1>
          <p className="text-text-400 mt-1">Schedule and manage meetings</p>
        </div>
        <Button variant="primary" onClick={() => setShowNewMeeting(true)}>+ Schedule Meeting</Button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-error/20 border border-error rounded-lg text-error">
          {error}
        </div>
      )}

      {isLoading && meetings.length === 0 && (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p className="text-text-400">Loading meetings...</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-text-100">
                {selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </h2>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() - 1)))}
                >
                  ← Prev
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() + 1)))}
                >
                  Next →
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-sm font-semibold text-text-400 py-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 35 }, (_, i) => {
                const firstDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
                const dayOffset = firstDay.getDay();
                const dayNum = i - dayOffset + 1;
                const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), dayNum);
                const isCurrentMonth = dayNum > 0 && dayNum <= new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
                const isToday = date.toDateString() === new Date().toDateString();
                const hasMeetings = isCurrentMonth && getDayMeetings(date).length > 0;

                return (
                  <button
                    key={i}
                    onClick={() => isCurrentMonth && setSelectedDate(date)}
                    className={`
                      p-3 rounded-lg text-sm transition-colors relative
                      ${!isCurrentMonth ? 'text-text-500' : ''}
                      ${isToday ? 'bg-primary-500/20 border-2 border-primary-500' : 'hover:bg-bg-700'}
                      ${hasMeetings ? 'border-2 border-info' : 'border border-border-12'}
                    `}
                  >
                    {isCurrentMonth ? dayNum : ''}
                    {hasMeetings && (
                      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                        <div className="w-1.5 h-1.5 bg-info rounded-full"></div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Day's Meetings */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-text-100">
              {selectedDate.toLocaleDateString('default', { weekday: 'long', month: 'short', day: 'numeric' })}
            </h2>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {dayMeetings.length === 0 ? (
              <p className="text-center text-text-400 py-8">No meetings scheduled</p>
            ) : (
              dayMeetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className={`p-4 rounded-lg border-l-4 ${meetingTypeColors[meeting.meetingType || 'other']} bg-bg-800`}
                >
                  <h3 className="font-semibold text-text-100 mb-2">{meeting.title}</h3>
                  <div className="text-sm text-text-400 mb-2">
                    🕐 {new Date(meeting.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  {meeting.videoLink && (
                    <a
                      href={meeting.videoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-400 hover:text-primary-300 text-sm"
                    >
                      📹 Join Meeting
                    </a>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* New Meeting Modal */}
      {showNewMeeting && (
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-lg font-semibold text-text-100">Schedule New Meeting</h2>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleCreateMeeting} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-400 mb-1">Title</label>
                <input
                  type="text"
                  value={newMeeting.title}
                  onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                  className="w-full px-4 py-2 bg-bg-800 border border-border-12 rounded-lg text-text-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-400 mb-1">Start Time</label>
                  <input
                    type="datetime-local"
                    value={newMeeting.startTime}
                    onChange={(e) => setNewMeeting({ ...newMeeting, startTime: e.target.value })}
                    className="w-full px-4 py-2 bg-bg-800 border border-border-12 rounded-lg text-text-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-400 mb-1">End Time</label>
                  <input
                    type="datetime-local"
                    value={newMeeting.endTime}
                    onChange={(e) => setNewMeeting({ ...newMeeting, endTime: e.target.value })}
                    className="w-full px-4 py-2 bg-bg-800 border border-border-12 rounded-lg text-text-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-400 mb-1">Type</label>
                  <select
                    value={newMeeting.meetingType}
                    onChange={(e) => setNewMeeting({ ...newMeeting, meetingType: e.target.value })}
                    className="w-full px-4 py-2 bg-bg-800 border border-border-12 rounded-lg text-text-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="team">Team Meeting</option>
                    <option value="one-on-one">1-on-1</option>
                    <option value="client">Client Call</option>
                    <option value="interview">Interview</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-400 mb-1">Location Type</label>
                  <select
                    value={newMeeting.locationType}
                    onChange={(e) => setNewMeeting({ ...newMeeting, locationType: e.target.value })}
                    className="w-full px-4 py-2 bg-bg-800 border border-border-12 rounded-lg text-text-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="video">Video Call</option>
                    <option value="office">Office</option>
                    <option value="phone">Phone</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3">
                <Button type="submit" variant="primary">Create Meeting</Button>
                <Button type="button" variant="secondary" onClick={() => setShowNewMeeting(false)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
