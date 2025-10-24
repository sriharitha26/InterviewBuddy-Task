import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import StatusBadge from "@/components/StatusBadge";
import UserRoleDialog from "@/components/UserRoleDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { ChevronLeft, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function OrganizationDetails() {
  const { id } = useParams();
  const [organization, setOrganization] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  useEffect(() => {
    fetchOrganizationDetails();
    fetchUsers();
  }, [id]);

  const fetchOrganizationDetails = async () => {
    try {
      const { data, error } = await supabase
        .from("organizations")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setOrganization(data);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("*");

      if (profilesError) throw profilesError;

      const { data: rolesData, error: rolesError } = await supabase
        .from("user_roles")
        .select("*");

      if (rolesError) throw rolesError;
      
      const formattedUsers = profilesData?.map((profile) => {
        const userRole = rolesData?.find((r) => r.user_id === profile.user_id);
        return {
          user_id: profile.user_id,
          full_name: profile.full_name,
          role: userRole?.role || "co-author",
        };
      }) || [];

      setUsers(formattedUsers);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleChangeRole = (user: any) => {
    setSelectedUser(user);
    setRoleDialogOpen(true);
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-8">Loading...</div>
      </Layout>
    );
  }

  if (!organization) {
    return (
      <Layout>
        <div className="text-center py-8">Organization not found</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/organizations">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{organization.name}</h1>
            <p className="text-muted-foreground">Organization Details</p>
          </div>
        </div>

        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList>
            <TabsTrigger value="basic">Basic Details</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Profile</CardTitle>
                  <StatusBadge status={organization.status} />
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-4">
                    Organization Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Organization ID</p>
                      <p className="font-medium">{organization.id.slice(0, 8)}...</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <p className="font-medium capitalize">{organization.status}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-4">
                    Contact Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Primary Admin Email</p>
                      <p className="font-medium">{organization.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Primary Admin Mobile No.</p>
                      <p className="font-medium">{organization.phone || "N/A"}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-muted-foreground">Support Email</p>
                      <p className="font-medium">{organization.email}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p className="font-medium">
                        {organization.address || "N/A"}
                        {organization.city && `, ${organization.city}`}
                        {organization.state && `, ${organization.state}`}
                        {organization.pincode && ` - ${organization.pincode}`}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-4">
                    Maximum Allowed Coordinators
                  </h3>
                  <p className="font-medium">
                    Upto {organization.max_coordinators} Coordinators
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-4">Timezone</h3>
                  <p className="font-medium">{organization.timezone}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-4">Language</h3>
                  <p className="font-medium">{organization.language}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-4">
                    Official Website URL
                  </h3>
                  <p className="font-medium">{organization.website_url || "N/A"}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Users</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sl. No.</TableHead>
                      <TableHead>User Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user, index) => (
                      <TableRow key={user.user_id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-medium">{user.full_name}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              user.role === "admin"
                                ? "bg-primary/10 text-primary hover:bg-primary/20"
                                : "bg-info/10 text-info hover:bg-info/20"
                            }
                          >
                            {user.role === "admin" ? "Admin" : "Co-author"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleChangeRole(user)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Change
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {selectedUser && (
          <UserRoleDialog
            open={roleDialogOpen}
            onOpenChange={setRoleDialogOpen}
            user={selectedUser}
            onSuccess={fetchUsers}
          />
        )}
      </div>
    </Layout>
  );
}
