import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AdminAnnouncementsProps {
  adminKey: string;
  onSuccess: () => void;
  onError: (message: string) => void;
}

export default function AdminAnnouncements({ adminKey, onSuccess, onError }: AdminAnnouncementsProps) {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('info');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_URL = 'https://functions.poehali.dev/51925830-8d38-4748-99dc-dc5df4e26ac4';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !message.trim()) {
      onError('Title and message are required');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'X-Admin-Key': adminKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: title.trim(),
          message: message.trim(),
          type
        })
      });

      const data = await response.json();

      if (!response.ok) {
        onError(data.error || 'Failed to create announcement');
        return;
      }

      onSuccess();
      setTitle('');
      setMessage('');
      setType('info');
    } catch (error) {
      onError('Network error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Icon name="Megaphone" size={20} className="text-white" />
        <h2 className="text-lg font-semibold text-white">Create Announcement</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-white">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="New feature update"
            className="bg-white/5 border-white/20 text-white placeholder:text-zinc-500"
            maxLength={255}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="message" className="text-white">Message</Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="We've added new DDoS attack methods..."
            className="bg-white/5 border-white/20 text-white placeholder:text-zinc-500 min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type" className="text-white">Type</Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="bg-white/5 border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="error">Error</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-white text-black hover:bg-white/90"
        >
          {isSubmitting ? 'Publishing...' : 'Publish Announcement'}
        </Button>
      </form>
    </div>
  );
}
