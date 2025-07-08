import React, { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Auth from '@/pages/Auth';
import Profile from './pages/Profile';
import Chat from './pages/chat';
import { useAppStore } from './store';
import { apiClient } from './lib/api-client';
import { GET_USER_INFO } from './utils/constant';
import { Button } from '@/components/ui/button.tsx';

const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo && !!userInfo.id;
  return isAuthenticated ? children : <Navigate to="/Auth" />;
};

const Authroute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo && !!userInfo.id;
  return isAuthenticated ? <Navigate to="/chat" /> : children;
};

function App() {
  const { userInfo, setUserInfo } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [notificationPermission, setNotificationPermission] = useState(Notification?.permission);

  useEffect(() => {
    // Step 1: Hydrate Zustand from localStorage
    const storedUser = localStorage.getItem("chat-user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed && parsed.id) {
          setUserInfo(parsed);
        }
      } catch (err) {
        console.error("Invalid user info in localStorage");
      }
    }
  }, [setUserInfo]);

  useEffect(() => {
    // Step 2: Get fresh user data from API (optional)
    const getUserData = async () => {
      try {
        const response = await apiClient.get(GET_USER_INFO, {
          withCredentials: true,
        });
        if (response.status === 200 && response.data.id) {
          setUserInfo(response.data);
          localStorage.setItem("chat-user", JSON.stringify(response.data)); // Keep it in sync
        } else {
          setUserInfo(undefined);
          localStorage.removeItem("chat-user");
        }
      } catch (error) {
        setUserInfo(undefined);
        localStorage.removeItem("chat-user");
      } finally {
        setLoading(false);
      }
    };

    if (!userInfo?.id) {
      getUserData();
    } else {
      setLoading(false);
    }
  }, [userInfo, setUserInfo]);

  const handleRequestNotificationPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then((permission) => {
        setNotificationPermission(permission);
        console.log("Notification permission:", permission);
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* Optional: Notification request */}
      {/* {notificationPermission !== 'granted' && (
        <div style={{ margin: '1em' }}>
          <Button onClick={handleRequestNotificationPermission}>
            Enable Notifications
          </Button>
        </div>
      )} */}

      <BrowserRouter>
        <Routes>
          <Route
            path="/Auth"
            element={
              <Authroute>
                <Auth />
              </Authroute>
            }
          />
          <Route
            path="/Profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <PrivateRoute>
                <Chat />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/Auth" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
