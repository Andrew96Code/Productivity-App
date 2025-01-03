'use client';

import { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type TimeBlock = {
  id: string;
  start: string;
  end: string;
  activity: string;
  category: string;
};

export function TimeBlockingTool() {
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([]);
  const [newBlock, setNewBlock] = useState({
    start: '',
    end: '',
    activity: '',
    category: 'work', // Set a default category
  });

  const addTimeBlock = () => {
    if (newBlock.start && newBlock.end && newBlock.activity && newBlock.category) {
      setTimeBlocks([...timeBlocks, { ...newBlock, id: Date.now().toString() }]);
      setNewBlock({ start: '', end: '', activity: '', category: 'work' });
    } else {
      alert('Please fill in all fields before adding a time block.');
    }
  };

  const deleteTimeBlock = (id: string) => {
    setTimeBlocks(timeBlocks.filter((block) => block.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Time Blocking Tool</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="start-time">Start Time</Label>
              <Input
                id="start-time"
                type="time"
                value={newBlock.start}
                onChange={(e) =>
                  setNewBlock({ ...newBlock, start: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="end-time">End Time</Label>
              <Input
                id="end-time"
                type="time"
                value={newBlock.end}
                onChange={(e) =>
                  setNewBlock({ ...newBlock, end: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="activity">Activity</Label>
              <Input
                id="activity"
                value={newBlock.activity}
                onChange={(e) =>
                  setNewBlock({ ...newBlock, activity: e.target.value })
                }
                placeholder="Enter activity"
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={newBlock.category}
                onValueChange={(value) => setNewBlock({ ...newBlock, category: value })}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="health">Health</SelectItem>
                  <SelectItem value="learning">Learning</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={addTimeBlock}>Add Time Block</Button>
            </div>
          </div>
          <div className="space-y-2">
            {timeBlocks.map((block) => (
              <Card key={block.id}>
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{block.activity}</p>
                    <p className="text-sm text-gray-500">
                      {block.start} - {block.end} | {block.category}
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteTimeBlock(block.id)}
                  >
                    Delete
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

