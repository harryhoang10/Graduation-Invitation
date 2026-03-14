/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import Hero from './components/Hero';
import Personalization from './components/Personalization';
import Storytelling from './components/Storytelling';
import Timeline from './components/Timeline';
import EventDetails from './components/EventDetails';
import Parking from './components/Parking';
import RSVP from './components/RSVP';
import { DataProvider } from './context/DataContext';
import { AdminPanel } from './components/AdminPanel';
import { AdminLogin } from './components/AdminLogin';
import StarryBackground from './components/StarryBackground';
import { Navbar } from './components/Navbar';
import { AudioPlayer } from './components/AudioPlayer';

export default function App() {
  const [guestName, setGuestName] = useState('');
  const [pronoun, setPronoun] = useState('Bạn');
  const [isUnlocked, setIsUnlocked] = useState(false);

  const fullName = guestName ? `${pronoun} ${guestName}` : pronoun;

  return (
    <DataProvider>
      <div className="relative min-h-screen text-slate-100 font-sans selection:bg-primary/30 overflow-x-hidden">
        <StarryBackground />
        <AudioPlayer isUnlocked={isUnlocked} />
        
        <div className="relative z-10">
          {isUnlocked && <Navbar />}
          <Hero guestName={fullName} pronoun={pronoun} />
          <Personalization 
            guestName={guestName} 
            setGuestName={setGuestName} 
            pronoun={pronoun} 
            setPronoun={setPronoun} 
            onContinue={() => {
              setIsUnlocked(true);
              setTimeout(() => {
                document.getElementById('journey')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }} 
          />
          
          {isUnlocked && (
            <div className="animate-fade-in">
              <Storytelling guestName={fullName} pronoun={pronoun} />
              <Timeline guestName={fullName} pronoun={pronoun} />
              <EventDetails guestName={fullName} pronoun={pronoun} />
              <Parking guestName={fullName} pronoun={pronoun} />
              <RSVP guestName={fullName} pronoun={pronoun} />
            </div>
          )}
        </div>
        <AdminLogin />
        <AdminPanel />
      </div>
    </DataProvider>
  );
}
