import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AuthCardProps {
  children: React.ReactNode;
  title: string;
  description: string;
}

const AuthCard = ({ children, title, description }: AuthCardProps) => {
  return (
    <Card className="w-[380px] auth-card">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default AuthCard;