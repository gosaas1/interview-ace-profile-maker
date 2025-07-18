import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, FileText, Briefcase, Users, BarChart3, Settings, LogOut, Search, Bell, User, Crown } from 'lucide-react';
import CVUploadModal from '../cv/CVUploadModal';
import JobFoldersList from '../folders/JobFoldersList';
import { CVBuilder } from '../cv/CVBuilder';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showCVUpload, setShowCVUpload] = useState(false);
  const [showCVBuilder, setShowCVBuilder] = useState(false);

  const stats = [
    { 
      label: 'CVs Created', 
      value: '12', 
      icon: FileText, 
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      change: '+3 this month'
    },
    { 
      label: 'Applications Sent', 
      value: '28', 
      icon: Briefcase, 
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-700',
      change: '+8 this week'
    },
    { 
      label: 'Interviews Scheduled', 
      value: '7', 
      icon: Users, 
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      change: '+2 pending'
    },
    { 
      label: 'Success Rate', 
      value: '89%', 
      icon: BarChart3, 
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
      change: '+12% vs avg'
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/50 flex">
      {/* Premium Sidebar */}
      <div className="w-72 bg-white shadow-xl border-r border-slate-200/60">
        {/* Logo & Branding */}
        <div className="p-8 border-b border-slate-100">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">CVCraft AI</h1>
              <p className="text-sm text-slate-500 font-medium">Professional Suite</p>
            </div>
          </div>
          
          {/* User Profile */}
          <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-slate-900 text-sm">John Smith</p>
              <div className="flex items-center space-x-1">
                <Crown className="h-3 w-3 text-amber-500" />
                <span className="text-xs text-slate-600 font-medium">Pro Plan</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="px-6 py-4 space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
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
            className="w-full justify-start text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-3" />
            Sign Out
          </Button>
          
          <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white">
            <h3 className="font-semibold text-sm mb-1">Upgrade to Enterprise</h3>
            <p className="text-xs text-blue-100 mb-3">Unlock advanced AI features</p>
            <Button size="sm" className="w-full bg-white text-blue-600 hover:bg-blue-50">
              Learn More
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Premium Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {activeTab === 'overview' && 'Dashboard Overview'}
                {activeTab === 'cvs' && 'CV Library'}
                {activeTab === 'jobs' && 'Job Applications'}
                {activeTab === 'settings' && 'Account Settings'}
              </h2>
              <p className="text-slate-600 mt-1">
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
                  className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                />
              </div>
              
              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 text-slate-600" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </Button>
              
              {/* Action Buttons */}
              {(activeTab === 'overview' || activeTab === 'cvs') && (
                <div className="flex space-x-3">
                  <Button 
                    variant="outline"
                    onClick={() => setShowCVUpload(true)}
                    className="border-slate-200 hover:bg-slate-50"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Upload CV
                  </Button>
                  <Button 
                    onClick={() => setShowCVBuilder(true)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create CV
                  </Button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <Card key={index} className="hover-lift border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                          <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                          <p className="text-sm text-slate-600 mt-1">{stat.change}</p>
                        </div>
                      </div>
                      <p className="font-semibold text-slate-700">{stat.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-slate-900">Recent Activity</CardTitle>
                    <CardDescription className="text-slate-600">Your latest CV updates and applications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="flex items-center space-x-4 p-4 bg-slate-50/50 rounded-xl">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                          <FileText className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900">CV optimized for Senior Developer</p>
                          <p className="text-sm text-slate-600">TechCorp Inc. • 2 hours ago</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-slate-900">Performance Insights</CardTitle>
                    <CardDescription className="text-slate-600">AI-powered recommendations</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200/50">
                      <p className="font-semibold text-emerald-800 mb-1">Excellent ATS Score</p>
                      <p className="text-sm text-emerald-700">Your latest CV has a 94% ATS compatibility rating</p>
                    </div>
                    <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-200/50">
                      <p className="font-semibold text-blue-800 mb-1">Keyword Optimization</p>
                      <p className="text-sm text-blue-700">Consider adding "machine learning" to boost relevance</p>
                    </div>
                    <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-200/50">
                      <p className="font-semibold text-purple-800 mb-1">Interview Tips</p>
                      <p className="text-sm text-purple-700">3 new interview questions available for your applications</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'cvs' && (
            <div className="space-y-6">
              <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-slate-900">CV Collection</CardTitle>
                  <CardDescription className="text-slate-600">Manage your professional CV library and templates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((cv) => (
                      <Card key={cv} className="hover-lift border border-slate-200 bg-white">
                        <CardContent className="p-6">
                          <div className="flex items-center space-x-3 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                              <FileText className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-slate-900">Senior Developer CV</h3>
                              <p className="text-sm text-slate-600">Tech Industry Focus</p>
                            </div>
                          </div>
                          <div className="space-y-2 text-sm text-slate-600">
                            <p>ATS Score: <span className="font-semibold text-emerald-600">94%</span></p>
                            <p>Last updated: <span className="font-medium">2 hours ago</span></p>
                            <p>Applications: <span className="font-medium">5 sent</span></p>
                          </div>
                          <div className="flex space-x-2 mt-4">
                            <Button size="sm" variant="outline" className="flex-1">Edit</Button>
                            <Button size="sm" className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">View</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'jobs' && <JobFoldersList />}

          {activeTab === 'settings' && (
            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-slate-900">Account Settings</CardTitle>
                <CardDescription className="text-slate-600">Manage your preferences and subscription</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">Professional Plan</h3>
                      <p className="text-sm text-slate-600">Unlimited CVs • Advanced AI • Priority Support</p>
                      <p className="text-sm text-slate-500 mt-2">Next billing: March 15, 2025</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-slate-900">$29<span className="text-base font-normal text-slate-600">/mo</span></p>
                      <Button size="sm" variant="outline" className="mt-2">Manage Plan</Button>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-slate-900">Profile Settings</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                        <input type="text" defaultValue="John Smith" className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                        <input type="email" defaultValue="john@company.com" className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold text-slate-900">Preferences</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <span className="text-sm font-medium text-slate-700">Email Notifications</span>
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <span className="text-sm font-medium text-slate-700">Auto-save CVs</span>
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <span className="text-sm font-medium text-slate-700">AI Suggestions</span>
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>

      {/* Modals */}
      {showCVUpload && (
        <CVUploadModal onClose={() => setShowCVUpload(false)} />
      )}
      
      {showCVBuilder && (
        <CVBuilder onClose={() => setShowCVBuilder(false)} />
      )}
    </div>
  );
};

export default Dashboard;
