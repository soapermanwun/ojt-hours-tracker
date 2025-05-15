import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar, Clock } from "lucide-react";
import { NewTimeEntry } from "@/utils/types";

export default function EntryForm({
  data,
  isUpdate,
  isSubmitting,
  handleInputChange,
  handleAddEntry,
  handleUpdateEntry,
}: {
  data: NewTimeEntry;
  isUpdate: boolean;
  isSubmitting: boolean;
  handleInputChange: React.ChangeEventHandler<HTMLInputElement>;
  handleAddEntry?: () => Promise<void>;
  handleUpdateEntry?: () => Promise<void>;
}) {
  return (
    <Card className="border-none bg-transparent">
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="date" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" /> Date
            </Label>
            <Input
              id="date"
              type="date"
              name="date"
              value={data.date}
              onChange={handleInputChange}
              className="mt-1"
            />
          </div>

          <div>
            <Label className="flex items-center gap-2">
              <Clock className="h-4 w-4" /> Morning
            </Label>
            <div className="flex gap-2 mt-1">
              <div className="w-1/2">
                <Input
                  type="time"
                  name="morning_time_in"
                  placeholder="Time In"
                  value={data.morning_time_in}
                  onChange={handleInputChange}
                />
                <span className="text-xs text-gray-500">Time In</span>
              </div>
              <div className="w-1/2">
                <Input
                  type="time"
                  name="morning_time_out"
                  placeholder="Time Out"
                  value={data.morning_time_out}
                  onChange={handleInputChange}
                />
                <span className="text-xs text-gray-500">Time Out</span>
              </div>
            </div>
          </div>

          <div>
            <Label className="flex items-center gap-2">
              <Clock className="h-4 w-4" /> Afternoon
            </Label>
            <div className="flex gap-2 mt-1">
              <div className="w-1/2">
                <Input
                  type="time"
                  name="afternoon_time_in"
                  placeholder="Time In"
                  value={data.afternoon_time_in}
                  onChange={handleInputChange}
                />
                <span className="text-xs text-gray-500">Time In</span>
              </div>
              <div className="w-1/2">
                <Input
                  type="time"
                  name="afternoon_time_out"
                  placeholder="Time Out"
                  value={data.afternoon_time_out}
                  onChange={handleInputChange}
                />
                <span className="text-xs text-gray-500">Time Out</span>
              </div>
            </div>
          </div>

          <div>
            <Label className="flex items-center gap-2">
              <Clock className="h-4 w-4" /> Evening (Optional)
            </Label>
            <div className="flex gap-2 mt-1">
              <div className="w-1/2">
                <Input
                  type="time"
                  name="evening_time_in"
                  placeholder="Time In"
                  value={data.evening_time_in}
                  onChange={handleInputChange}
                />
                <span className="text-xs text-gray-500">Time In</span>
              </div>
              <div className="w-1/2">
                <Input
                  type="time"
                  name="evening_time_out"
                  placeholder="Time Out"
                  value={data.evening_time_out}
                  onChange={handleInputChange}
                />
                <span className="text-xs text-gray-500">Time Out</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        {!isUpdate ? (
          <Button
            disabled={isSubmitting}
            className="w-full text-foreground"
            onClick={handleAddEntry}
          >
            {isSubmitting ? (
              <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
            ) : (
              <p>Add Time Entry</p>
            )}
          </Button>
        ) : (
          <Button
            disabled={isSubmitting}
            className="w-full text-foreground"
            onClick={handleUpdateEntry}
          >
            {isSubmitting ? (
              <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
            ) : (
              <p>Update Time Entry</p>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
