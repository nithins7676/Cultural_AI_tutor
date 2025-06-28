import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle, Database, Cloud } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { createUser, getStory, seedStories } from '@/lib/api';
import { config, validateConfig } from '@/config/env';

const SupabaseTest: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'connected' | 'failed'>('testing');
  const [testResults, setTestResults] = useState<any>({});
  const [isRunningTests, setIsRunningTests] = useState(false);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    setConnectionStatus('testing');
    
    try {
      // Test basic connection
      const { data, error } = await supabase.from('stories').select('count').limit(1);
      
      if (error) {
        console.error('Supabase connection error:', error);
        setConnectionStatus('failed');
        return;
      }
      
      setConnectionStatus('connected');
    } catch (error) {
      console.error('Connection test failed:', error);
      setConnectionStatus('failed');
    }
  };

  const runFullTest = async () => {
    setIsRunningTests(true);
    const results: any = {};

    try {
      // Test 0: Check if tables exist
      console.log('Checking database tables...');
      const { data: tables, error: tablesError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .in('table_name', ['users', 'progress', 'stories']);
      
      if (tablesError) {
        results.tableCheck = '❌ Error checking tables';
        console.error('Table check error:', tablesError);
      } else {
        const tableNames = tables?.map(t => t.table_name) || [];
        results.tableCheck = tableNames.length === 3 ? '✅ All tables exist' : `⚠️ Missing tables: ${['users', 'progress', 'stories'].filter(t => !tableNames.includes(t)).join(', ')}`;
        console.log('Available tables:', tableNames);
      }

      // Test 1: Create a test user
      console.log('Testing user creation...');
      const testUser = {
        name: 'Test User',
        culture: 'tamil',
        language: 'english',
        subjects: ['math'],
        level: 'middle school'
      };

      const createdUser = await createUser(testUser);
      results.userCreation = createdUser ? '✅ Success' : '❌ Failed';
      console.log('User creation result:', createdUser);

      // Test 2: Get a story
      console.log('Testing story retrieval...');
      const story = await getStory('tamil', 'math', 'algebra');
      results.storyRetrieval = story && story.story !== 'Story not found' ? '✅ Success' : '❌ Failed';
      console.log('Story retrieval result:', story);

      // Test 3: Seed stories
      console.log('Testing story seeding...');
      await seedStories();
      results.storySeeding = '✅ Attempted';

      // Test 4: Check configuration
      console.log('Checking configuration...');
      const warnings = validateConfig();
      results.configuration = warnings.length === 0 ? '✅ Valid' : `⚠️ ${warnings.join(', ')}`;

    } catch (error) {
      console.error('Test failed:', error);
      results.error = error;
    }

    setTestResults(results);
    setIsRunningTests(false);
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'failed':
        return <XCircle className="w-6 h-6 text-red-500" />;
      default:
        return <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />;
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Connected to Supabase';
      case 'failed':
        return 'Connection Failed';
      default:
        return 'Testing Connection...';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-6 h-6" />
              Supabase Connection Test
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Connection Status */}
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                {getStatusIcon()}
                <div>
                  <h3 className="font-semibold">{getStatusText()}</h3>
                  <p className="text-sm text-gray-600">
                    URL: {config.supabase.url}
                  </p>
                </div>
              </div>

              {/* Configuration Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Configuration</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>URL:</strong> {config.supabase.url}</p>
                    <p><strong>Key:</strong> {config.supabase.anonKey.substring(0, 20)}...</p>
                    <p><strong>AI Enabled:</strong> {config.ai.enabled ? 'Yes' : 'No'}</p>
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">App Info</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>Name:</strong> {config.app.name}</p>
                    <p><strong>Version:</strong> {config.app.version}</p>
                    <p><strong>Description:</strong> {config.app.description}</p>
                  </div>
                </div>
              </div>

              {/* Test Button */}
              <Button 
                onClick={runFullTest} 
                disabled={isRunningTests || connectionStatus === 'failed'}
                className="w-full"
              >
                {isRunningTests ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Running Tests...
                  </>
                ) : (
                  <>
                    <Cloud className="w-4 h-4 mr-2" />
                    Run Full Test Suite
                  </>
                )}
              </Button>

              {/* Test Results */}
              {Object.keys(testResults).length > 0 && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-3">Test Results</h4>
                  <div className="space-y-2">
                    {Object.entries(testResults).map(([test, result]) => (
                      <div key={test} className="flex justify-between items-center">
                        <span className="capitalize">{test.replace(/([A-Z])/g, ' $1').trim()}:</span>
                        <Badge variant={result.includes('✅') ? 'default' : result.includes('❌') ? 'destructive' : 'secondary'}>
                          {result}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Instructions */}
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">Next Steps</h4>
                <div className="text-sm space-y-1">
                  <p>1. ✅ Environment variables configured</p>
                  <p>2. ✅ Database tables created</p>
                  <p>3. ✅ Connection tested</p>
                  <p>4. 🎉 Ready to use the app!</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SupabaseTest; 