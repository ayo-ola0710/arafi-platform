import { useState, useEffect } from 'react';
import { Joyride } from 'react-joyride';
import type { Step } from 'react-joyride';

export default function GuidedTour() {
  const [run, setRun] = useState(false);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('arafi_tour_completed');
    if (!hasSeenTour) {
      setTimeout(() => setRun(true), 1200);
    }
  }, []);

  const steps: Step[] = [
    {
      // Welcome slide — centered on screen, no spotlight target
      target: 'body',
      placement: 'center',
      title: '👋 Welcome to Arafi',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <p>Your Payment & Subscription infrastructure, fully managed.</p>
          <p style={{ color: '#a1a1aa', fontSize: '12px' }}>
            Let's take a 60-second tour of the key areas so you can hit the ground running.
          </p>
        </div>
      ),
    },
    {
      target: '#tour-api-keys',
      placement: 'bottom-end',
      title: '🔑 Your API Keys',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <p>Copy your <strong style={{ color: '#c5b4e3' }}>Sandbox Key</strong> to start testing without real money.</p>
          <p style={{ color: '#a1a1aa', fontSize: '12px' }}>
            When you're ready to go live, swap it for your Live Key in <strong>Settings → API Keys</strong>.
          </p>
        </div>
      ),
    },
    {
      target: '#tour-metrics',
      placement: 'bottom',
      title: '📊 Platform Metrics',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <p>Track your <strong style={{ color: '#c5b4e3' }}>balance, subscribers, MRR,</strong> and virtual accounts — all in real time.</p>
          <p style={{ color: '#a1a1aa', fontSize: '12px' }}>
            These numbers update automatically as your customers subscribe and pay.
          </p>
        </div>
      ),
    },
    {
      target: '#tour-quick-actions',
      placement: 'right',
      title: '⚡ Quick Actions',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <p>Your most common tasks are one click away here.</p>
          <p style={{ color: '#a1a1aa', fontSize: '12px' }}>
            <strong style={{ color: '#c5b4e3' }}>Start by creating a Plan</strong> — then you can register subscribers and manage billing automatically.
          </p>
        </div>
      ),
    },
    {
      target: '#tour-recent-activity',
      placement: 'top',
      title: '🕐 Recent Activity',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <p>Your latest subscribers and virtual accounts will appear here as they come in live.</p>
          <p style={{ color: '#a1a1aa', fontSize: '12px' }}>
            Explore the <strong style={{ color: '#c5b4e3' }}>sidebar</strong> to dive deeper into Plans, Customers, Coupons, Payouts, and more.
          </p>
        </div>
      ),
    },
  ];

  const handleEvent = (data: any) => {
    const { status } = data;
    if (status === 'finished' || status === 'skipped') {
      setRun(false);
      localStorage.setItem('arafi_tour_completed', 'true');
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      scrollToFirstStep
      showSkipButton
      showProgress
      onEvent={handleEvent}
      options={{
        arrowColor: '#1e1e1e',
        backgroundColor: '#1e1e1e',
        overlayColor: 'rgba(0, 0, 0, 0.75)',
        primaryColor: '#c5b4e3',
        textColor: '#e4e4e7',
        zIndex: 10000,
      }}
      styles={{
        tooltip: {
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
          padding: '20px 24px',
        },
        tooltipTitle: {
          fontSize: '15px',
          fontWeight: 'bold',
          marginBottom: '8px',
          color: '#ffffff',
        },
        tooltipContent: {
          fontSize: '13px',
          lineHeight: '1.6',
          paddingTop: '4px',
          paddingBottom: '4px',
        },
        tooltipContainer: {
          textAlign: 'left',
          fontFamily: '"JetBrains Mono", monospace',
        },
        tooltipFooter: {
          marginTop: '16px',
          gap: '8px',
        },
        buttonNext: {
          backgroundColor: '#c5b4e3',
          color: '#1a1a1a',
          fontFamily: '"JetBrains Mono", monospace',
          fontWeight: 'bold',
          borderRadius: '8px',
          padding: '8px 16px',
          fontSize: '12px',
        },
        buttonBack: {
          color: '#c5b4e3',
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '12px',
        },
        buttonSkip: {
          color: '#71717a',
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '12px',
        },
        buttonClose: {
          color: '#71717a',
          top: '12px',
          right: '12px',
        },
      }}
    />
  );
}
