import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Dice6 } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import '@/styles/task-view.css';
import { Textarea } from "@/components/ui/textarea";

interface Task {
  id: string;
  title: string;
  type_id: string;
  task_type: {
    id: string;
    name: string;
    description: string;
  };
}

interface DerivedTaskView {
  id: string;
  name: string;
  component_name: string;
  is_default: boolean;
  description: string;
}

interface TaskViewProps {
  task: Task | null;
  onClose: () => void;
  selectedViewId: string | null;
}

interface TaskTypeViewProps {
  task: {
    id: string;
    title: string;
    type_id: string;
  };
  onClose: () => void;
}

// Default SetDisplayName view
function SetDisplayNameView({ task, onClose }: TaskTypeViewProps) {
  const [displayName, setDisplayName] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSubmit = async () => {
    if (!displayName.trim()) return;
    
    setIsUpdating(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('No user found');

      console.log('Updating profile display name...');
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ display_name: displayName })
        .eq('id', user.id);

      if (profileError) throw profileError;

      console.log('Marking task as complete...');
      const { data: taskData, error: taskError } = await supabase
        .from('tasks')
        .update({ status: 'Complete' })
        .eq('id', task.id)
        .select()
        .single();

      if (taskError) {
        console.error('Error updating task status:', taskError);
        throw taskError;
      }
      console.log('Task updated:', taskData);

      onClose();
    } catch (error) {
      console.error('Error updating display name:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm text-gray-500">
          Choose a display name for yourself
        </p>
        <Input
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Enter your display name"
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose} disabled={isUpdating}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={!displayName.trim() || isUpdating}>
          {isUpdating ? "Updating..." : "Update Display Name"}
        </Button>
      </div>
    </div>
  );
}

// Cutesy SetDisplayName view
function SetDisplayNameCutesyView({ task, onClose }: TaskTypeViewProps) {
  const [cuteName, setCuteName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchRandomCuteName = async () => {
    setIsLoading(true);
    try {
      // Get a random untaken name using our stored procedure
      const { data, error } = await supabase
        .rpc('get_random_untaken_cute_name');

      if (error) throw error;
      if (!data || data.length === 0) throw new Error('No cute names available');

      setCuteName(data[0].name);
    } catch (error) {
      console.error('Error fetching cute name:', error);
      // Fallback to a default cute name if something goes wrong
      setCuteName('★ Cutie ★');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!cuteName.trim()) return;
    
    setIsUpdating(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('No user found');

      // Mark the cute name as taken
      const { data: cuteNameData } = await supabase
        .from('cute_names')
        .select('id')
        .eq('name', cuteName)
        .single();

      if (cuteNameData) {
        const { error: updateError } = await supabase
          .from('cute_names')
          .update({ taken: true })
          .eq('id', cuteNameData.id);

        if (updateError) throw updateError;
      }

      console.log('Updating profile display name...');
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ display_name: cuteName })
        .eq('id', user.id);

      if (profileError) throw profileError;

      console.log('Marking task as complete...');
      const { data: taskData, error: taskError } = await supabase
        .from('tasks')
        .update({ status: 'Complete' })
        .eq('id', task.id)
        .select()
        .single();

      if (taskError) {
        console.error('Error updating task status:', taskError);
        throw taskError;
      }
      console.log('Task updated:', taskData);

      onClose();
    } catch (error) {
      console.error('Error updating display name:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Fetch a random name when the component mounts
  useEffect(() => {
    fetchRandomCuteName();
  }, []);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm text-gray-500">
          Choose a cute display name decorated with adorable symbols!
        </p>
        <div className="flex items-center gap-2">
          <Input
            value={cuteName}
            readOnly
            placeholder="Loading cute name..."
            disabled={isLoading}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={fetchRandomCuteName}
            disabled={isLoading || isUpdating}
            title="Roll for a new cute name"
          >
            <Dice6 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose} disabled={isUpdating}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={!cuteName.trim() || isUpdating || isLoading}>
          {isUpdating ? "Updating..." : "Update Display Name"}
        </Button>
      </div>
    </div>
  );
}

// Anonymous SetDisplayName view
function SetDisplayNameAnonymousView({ task, onClose }: TaskTypeViewProps) {
  const [displayName, setDisplayName] = useState("Anonymous_");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSubmit = async () => {
    setIsUpdating(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('No user found');

      console.log('Updating profile display name...');
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ display_name: displayName })
        .eq('id', user.id);

      if (profileError) throw profileError;

      console.log('Marking task as complete...');
      const { data: taskData, error: taskError } = await supabase
        .from('tasks')
        .update({ status: 'Complete' })
        .eq('id', task.id)
        .select()
        .single();

      if (taskError) {
        console.error('Error updating task status:', taskError);
        throw taskError;
      }
      console.log('Task updated:', taskData);

      onClose();
    } catch (error) {
      console.error('Error updating display name:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        Your display name will be prefixed with "Anonymous_"
      </p>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose} disabled={isUpdating}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isUpdating}>
          {isUpdating ? "Updating..." : "Update Display Name"}
        </Button>
      </div>
    </div>
  );
}

function DefaultTaskView({ task, onClose }: TaskTypeViewProps) {
  return (
    <div className="task-view-container">
      <div className="task-view-card">
        <header className="task-view-header">
          <div className="flex justify-between items-center">
            <h1 className="task-view-title">{task.title}</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </header>
        <div className="task-view-content">
          <div>Default task view</div>
        </div>
      </div>
    </div>
  );
}

// Onboarding view
function OnboardingView({ task, onClose }: TaskTypeViewProps) {
  const [email, setEmail] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOnboardingData = async () => {
      try {
        // Get the onboarding record for this task
        const { data: onboardingData, error: onboardingError } = await supabase
          .from('onboarding')
          .select('email')
          .eq('status', 'pending')
          .single();

        if (onboardingError) throw onboardingError;
        if (!onboardingData) throw new Error('No onboarding data found');

        setEmail(onboardingData.email);
      } catch (error) {
        console.error('Error fetching onboarding data:', error);
        setEmail('Error loading email');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOnboardingData();
  }, []);

  const handleSubmit = async () => {
    // TODO: Implement onboarding submission
    console.log('Onboarding notes:', notes);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm text-gray-500">
          Review and process the new user onboarding
        </p>
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="text-sm font-medium">
              User Email
            </label>
            <Input
              id="email"
              value={email}
              readOnly
              disabled={isLoading}
              placeholder="Loading email..."
            />
          </div>
          <div>
            <label htmlFor="notes" className="text-sm font-medium">
              Onboarding Notes
            </label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter any notes about the onboarding process..."
              className="min-h-[150px]"
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button onClick={handleSubmit}>
          Submit
        </Button>
      </div>
    </div>
  );
}

// Main TaskView component that renders the appropriate view
export function TaskView({ task, onClose, selectedViewId }: TaskViewProps) {
  const [derivedViews, setDerivedViews] = useState<DerivedTaskView[]>([]);

  useEffect(() => {
    if (!task) return;

    const fetchDerivedViews = async () => {
      const { data, error } = await supabase
        .from('derived_task_views')
        .select('*')
        .eq('task_type_id', task.type_id);

      if (error) {
        console.error('Error fetching derived views:', error);
        return;
      }

      setDerivedViews(data || []);
    };

    fetchDerivedViews();
  }, [task]);

  if (!task) return null;

  const selectedView = derivedViews.find(view => view.id === selectedViewId);
  
  // Map component names to actual components
  const componentMap: Record<string, React.ComponentType<TaskTypeViewProps>> = {
    SetDisplayNameView,
    SetDisplayNameAnonymousView,
    SetDisplayNameCutesyView,
    OnboardingView,
    // Add other view components here
  };

  const ViewComponent = selectedView 
    ? componentMap[selectedView.component_name] || DefaultTaskView
    : DefaultTaskView;

  return <ViewComponent task={task} onClose={onClose} />;
}
