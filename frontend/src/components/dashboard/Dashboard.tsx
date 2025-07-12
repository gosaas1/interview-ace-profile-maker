import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, FileText, Briefcase, Users, BarChart3, Settings, LogOut, Search, Bell, User, Crown, Sparkles, TrendingUp, Award, Zap } from 'lucide-react';
import CVUploadModal from '../cv/CVUploadModal';
import JobFoldersList from '../folders/JobFoldersList';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [showCVUpload, setShowCVUpload] = useState(false);

  const stats = [
    { 
      label: 'CVs Created', 
      value: '12', 
      icon: FileText, 
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-gradient-to-br from-blue-50 to-indigo-50',
      textColor: 'text-blue-700',
      change: '+3 this month',
      trend: 'up'
    },
    { 
      label: 'Applications Sent', 
      value: '28', 
      icon: Briefcase, 
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-gradient-to-br from-emerald-50 to-teal-50',
      textColor: 'text-emerald-700',
      change: '+8 this week',
      trend: 'up'
    },
    { 
      label: 'Interviews Scheduled', 
      value: '7', 
      icon: Users, 
      color: 'from-purple-500 to-violet-600',
      bgColor: 'bg-gradient-to-br from-purple-50 to-violet-50',
      textColor: 'text-purple-700',
      change: '+2 pending',
      trend: 'up'
    },
    { 
      label: 'Success Rate', 
      value: '89%', 
      icon: BarChart3, 
      color: 'from-orange-500 to-amber-600',
      bgColor: 'bg-gradient-to-br from-orange-50 to-amber-50',
      textColor: 'text-orange-700',
      change: '+12% vs avg',
      trend: 'up'
    },
  ];

  const sidebarItems = [
    { id: 'overview', label: 'Dashboard', icon: BarChart3 },
    { id: 'cvs', label: 'CV Library', icon: FileText },
    { id: 'jobs', label: 'Applications', icon: Briefcase },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleLogout = () => {
    // TODO: Implement logout
    console.log('Logging out...');
  };

  const handleCreateCV = () => {
    navigate('/cv-builder');
  };

  const handleNavigateToSection = (section: string) => {
    if (section === 'cvs') {
      navigate('/cvs');
    } else if (section === 'jobs') {
      navigate('/jobs');
    } else {
      setActiveTab(section);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 via-purple-50/20 to-indigo-50/40 flex">
      {/* Premium Sidebar */}
      <div className="w-72 bg-white/90 backdrop-blur-sm shadow-2xl border-r border-slate-200/60">
        {/* Logo & Branding */}
        <div className="p-8 border-b border-slate-100/60">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">ApplyAce</h1>
              <p className="text-sm text-slate-500 font-medium">AI Career Suite</p>
            </div>
          </div>
          
          {/* User Profile */}
          <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl border border-blue-100/50">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
              <User className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-900 text-sm truncate">John Smith</p>
              <div className="flex items-center space-x-1 mt-1">
                <Crown className="h-3 w-3 text-amber-500 flex-shrink-0" />
                <span className="text-xs text-slate-600 font-medium truncate">Professional Plan</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="px-6 py-4 space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigateToSection(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300 ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white shadow-lg shadow-blue-500/25 transform scale-105'
                  : 'text-slate-700 hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50/30 hover:text-slate-900 hover:shadow-md'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
        
        {/* Bottom Actions */}
        <div className="absolute bottom-6 left-6 right-6 space-y-3">
          <Button
            variant="ghost"
            className="w-full justify-start text-slate-600 hover:text-slate-900 hover:bg-slate-50/50 rounded-xl h-10"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-3 flex-shrink-0" />
            <span className="truncate">Sign Out</span>
          </Button>
          
          <div className="p-4 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-2xl text-white shadow-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="h-4 w-4 flex-shrink-0" />
              <h3 className="font-semibold text-sm truncate">Upgrade to Elite</h3>
            </div>
            <p className="text-xs text-blue-100 mb-3 line-clamp-2">Unlock advanced AI features & coaching</p>
            <Button size="sm" className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30 rounded-xl h-8">
              <span className="truncate">Learn More</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Premium Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-8 py-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
                {activeTab === 'overview' && 'Dashboard Overview'}
                {activeTab === 'cvs' && 'CV Library'}
                {activeTab === 'jobs' && 'Job Applications'}
                {activeTab === 'settings' && 'Account Settings'}
              </h2>
              <p className="text-slate-600 mt-2 flex items-center">
                <Sparkles className="h-4 w-4 mr-2 text-blue-500" />
                {activeTab === 'overview' && 'Monitor your career progress and optimize your job search strategy'}
                {activeTab === 'cvs' && 'Create, customize, and manage your professional CV collection'}
                {activeTab === 'jobs' && 'Track applications and manage tailored CVs for each opportunity'}
                {activeTab === 'settings' && 'Customize your account preferences and subscription'}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm shadow-sm"
                />
              </div>
              
              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative hover:bg-slate-100/50 rounded-xl">
                <Bell className="h-5 w-5 text-slate-600" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse"></span>
              </Button>
              
              {/* Action Buttons */}
              {(activeTab === 'overview' || activeTab === 'cvs') && (
                <div className="flex space-x-3">
                  <Button 
                    variant="outline"
                    onClick={() => setShowCVUpload(true)}
                    className="border-slate-200 hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50/30 rounded-xl"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Upload CV
                  </Button>
                  <Button 
                    onClick={handleCreateCV}
                    className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white shadow-lg rounded-xl"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create CV
                  </Button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Welcome Banner */}
              <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">Welcome back, John! 👋</h3>
                      <p className="text-blue-100 text-lg">Ready to supercharge your career today?</p>
                    </div>
                    <div className="flex space-x-3">
                      <Button 
                        onClick={handleCreateCV}
                        className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm rounded-xl"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create New CV
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <Card key={index} className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br ${stat.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                              <stat.icon className="h-6 w-6 text-white" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-slate-600">{stat.label}</p>
                            <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                            <div className="flex items-center space-x-1">
                              <TrendingUp className="h-3 w-3 text-emerald-500" />
                              <span className="text-xs text-emerald-600 font-medium">{stat.change}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg rounded-2xl overflow-hidden">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <span>Quick Actions</span>
                    </CardTitle>
                    <CardDescription>Get started with your job search</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button 
                      onClick={handleCreateCV}
                      className="w-full justify-start bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-blue-700 border border-blue-200 rounded-xl h-12"
                    >
                      <Plus className="h-4 w-4 mr-3" />
                      Create New CV
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setShowCVUpload(true)}
                      className="w-full justify-start hover:bg-slate-50 rounded-xl h-12"
                    >
                      <FileText className="h-4 w-4 mr-3" />
                      Upload Existing CV
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => navigate('/jobs')}
                      className="w-full justify-start hover:bg-slate-50 rounded-xl h-12"
                    >
                      <Briefcase className="h-4 w-4 mr-3" />
                      Browse Jobs
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg rounded-2xl overflow-hidden">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center space-x-2">
                      <Award className="h-5 w-5 text-purple-600" />
                      <span>Recent Activity</span>
                    </CardTitle>
                    <CardDescription>Your latest career moves</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200/50">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <span className="text-sm text-slate-700">CV "Software Engineer" updated</span>
                        <span className="text-xs text-slate-500 ml-auto">2h ago</span>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200/50">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-slate-700">Applied to Google Inc.</span>
                        <span className="text-xs text-slate-500 ml-auto">5h ago</span>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border border-purple-200/50">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-sm text-slate-700">Interview scheduled with Meta</span>
                        <span className="text-xs text-slate-500 ml-auto">1d ago</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-2xl">
              <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg rounded-2xl">
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Manage your account preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">Settings panel coming soon...</p>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>

      {/* CV Upload Modal */}
      {showCVUpload && (
        <CVUploadModal
          onClose={() => setShowCVUpload(false)}
          onSuccess={() => {
            setShowCVUpload(false);
            // Refresh data or navigate
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
