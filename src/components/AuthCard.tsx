import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AuthCardProps {
  children: React.ReactNode;
  title: string;
  description: string;
}

const AuthCard = ({ children, title, description }: AuthCardProps) => {
  return (
    <Card className="content-card">
      <CardHeader className="content-card-header">
        <CardTitle className="content-card-title">{title}</CardTitle>
        <CardDescription className="content-card-description">{description}</CardDescription>
      </CardHeader>
      <CardContent className="content-card-content">{children}</CardContent>
    </Card>
  );
};

export default AuthCard;