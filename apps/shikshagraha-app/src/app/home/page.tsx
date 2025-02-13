/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
'use client';
import { Layout, DynamicCard } from '@shared-lib';
import LogoutIcon from '@mui/icons-material/Logout';
import { useRouter } from 'next/navigation';
import { fetchProfileData } from '../../services/ProfileService';
import { useEffect, useState } from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';
import AppConst from '../../utils/AppConst/AppConst';
export default function Home() {
  const basePath = AppConst?.BASEPATH;
  const cardData = [
    {
      title: 'Programs',
      icon: '/shikshagraha/assets/images/ic_program.png',
    },
    {
      title: 'Projects',
      icon: '/shikshagraha/assets/images/ic_project.png',
    },
    {
      title: 'Survey',
      icon: '/shikshagraha/assets/images/ic_survey.png',
    },
    {
      title: 'Reports',
      icon: '/shikshagraha/assets/images/ic_report.png',
    },
  ];

  const router = useRouter();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getProfileData = async () => {
      try {
        const token = localStorage.getItem('accToken') || '';
        const userId = localStorage.getItem('userId') || '';

        const data = await fetchProfileData(userId, token);
        setProfileData(data?.content[0]);
      } catch (err) {
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    getProfileData();
  }, []);

  const handleAccountClick = () => {
    router.push(`${process.env.NEXT_PUBLIC_LOGINPAGE}`);
    localStorage.removeItem('accToken');
    localStorage.clear();
  };
  const handleCardClick = (data) => {
    if (data) {
      const targetUrl = `${process.env.NEXT_PUBLIC_PWA}/home`;
      window.postMessage(data, targetUrl); // Pass data via postMessage
      window.open(targetUrl, '_self'); // Open Angular home page
    }
  };
  useEffect(() => {
    if (typeof window !== 'undefined' && profileData?.framework?.id) {
      localStorage.setItem('frameworkname', profileData.framework.id);
    }
  }, [profileData]);

  return (
    <Layout
      showTopAppBar={{
        title: 'Home',
        showMenuIcon: true,
        profileIcon: [
          {
            icon: <LogoutIcon />,
            ariaLabel: 'Account',
            onLogoutClick: handleAccountClick,
          },
        ],
      }}
      isFooter={true}
      showLogo={true}
      showBack={true}
    >
      <Box
        sx={{
          bgcolor: '#f5f5f5', // Set gray background
          minHeight: '100vh',
          py: 5,
          paddingTop: '20%',
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '50vh',
            }}
          >
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography variant="h6" color="error" textAlign="center">
            {error}
          </Typography>
        ) : (
          <>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography
                variant="h5"
                color="#582E92"
                fontWeight="bold"
                fontSize="20px"
              >
                Welcome, {profileData?.firstName}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                Browse Shikshagraha library to find relevant content based on
                your preferences (Board, Medium, Class, Subject)
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'flex',
                gap: 3,
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              {cardData
                .filter((card) => {
                  if (profileData?.userType === 'administrator') {
                    return true; // Show all cards for administrators
                  }
                  return card.title === 'Projects'; // Show only "Projects" for teacher and youth
                })
                .map((card, index) => (
                  <DynamicCard
                    key={index}
                    title={card.title}
                    icon={card.icon}
                    sx={{
                      borderRadius: 2,
                      boxShadow: 3,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: 6,
                      },
                    }}
                    onClick={() => handleCardClick(card.data)}
                  />
                ))}
            </Box>
          </>
        )}
      </Box>
    </Layout>
  );
}
