/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { StatsBar } from './components/StatsBar';
import { FolderView } from './components/FolderView';
import { ScannerModal } from './components/ScannerModal';
import { NetlifyImporterModal } from './components/NetlifyImporterModal';
import { DriveSyncPanel } from './components/DriveSyncPanel';
import { DocumentViewerModal } from './components/DocumentViewerModal';
import { EmailModal } from './components/EmailModal';
import { ScrollToTop } from './components/ScrollToTop';

import { initialDocuments } from './data/initialDocuments';
import { initialNetlifyProfiles } from './data/mockNetlifyData';
import { DocumentCategory, NetlifyUserProfile, ScannedDocument } from './types';

export default function App() {
  // Theme Mode
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Apply dark class to <html> for Tailwind v4 @custom-variant dark
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  // Documents & Netlify Profiles state with localStorage persistence
  const [documents, setDocuments] = useState<ScannedDocument[]>(() => {
    try {
      const saved = localStorage.getItem('ug_documents_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return initialDocuments;
  });

  const [netlifyProfiles, setNetlifyProfiles] = useState<NetlifyUserProfile[]>(() => {
    try {
      const saved = localStorage.getItem('ug_netlify_profiles_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return initialNetlifyProfiles;
  });

  // Google Drive Account Configuration
  const [driveConnected, setDriveConnected] = useState<boolean>(true);
  const userDriveEmail = 'scangt7@gmail.com';

  // Modals state
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isNetlifyOpen, setIsNetlifyOpen] = useState(false);
  const [isDriveOpen, setIsDriveOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<ScannedDocument | null>(null);
  const [emailDoc, setEmailDoc] = useState<ScannedDocument | null>(null);

  // Save to localStorage whenever documents or profiles change
  useEffect(() => {
    try {
      localStorage.setItem('ug_documents_v1', JSON.stringify(documents));
    } catch {
      // Ignore
    }
  }, [documents]);

  useEffect(() => {
    try {
      localStorage.setItem('ug_netlify_profiles_v1', JSON.stringify(netlifyProfiles));
    } catch {
      // Ignore
    }
  }, [netlifyProfiles]);

  // Document Handlers
  const handleAddDocument = (newDoc: ScannedDocument) => {
    setDocuments(prev => [newDoc, ...prev]);
  };

  const handleChangeCategory = (docId: string, newCategory: DocumentCategory) => {
    setDocuments(prev => prev.map(d => {
      if (d.id === docId) {
        return { ...d, category: newCategory };
      }
      return d;
    }));
    if (selectedDoc && selectedDoc.id === docId) {
      setSelectedDoc(prev => prev ? { ...prev, category: newCategory } : null);
    }
  };

  const handleSyncToDrive = (docId: string) => {
    setDocuments(prev => prev.map(d => {
      if (d.id === docId) {
        return { ...d, driveSynced: true, driveFileId: `gdrive_${Date.now()}` };
      }
      return d;
    }));
    if (selectedDoc && selectedDoc.id === docId) {
      setSelectedDoc(prev => prev ? { ...prev, driveSynced: true } : null);
    }
  };

  const handleSyncAllDocuments = () => {
    setDocuments(prev => prev.map(d => ({ ...d, driveSynced: true })));
  };

  const handleDeleteDocument = (docId: string) => {
    setDocuments(prev => prev.filter(d => d.id !== docId));
  };

  const handleImportNetlifyProfiles = (newProfiles: NetlifyUserProfile[]) => {
    setNetlifyProfiles(prev => {
      const mergedMap = new Map();
      prev.forEach(p => mergedMap.set(p.id, p));
      newProfiles.forEach(p => mergedMap.set(p.id, p));
      return Array.from(mergedMap.values());
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors">
      
      {/* Navigation Header */}
      <Header
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        scannerActive={true}
        onOpenScannerModal={() => setIsScannerOpen(true)}
        onOpenNetlifyModal={() => setIsNetlifyOpen(true)}
        onOpenDriveModal={() => setIsDriveOpen(true)}
        driveConnected={driveConnected}
        driveEmail={userDriveEmail}
        totalDocs={documents.length}
      />

      {/* Main Content Area */}
      <main>
        {/* Unboxed Metadata Stats Bar */}
        <StatsBar
          documents={documents}
          onOpenScanner={() => setIsScannerOpen(true)}
          onOpenNetlify={() => setIsNetlifyOpen(true)}
          onOpenDrive={() => setIsDriveOpen(true)}
          driveConnected={driveConnected}
        />

        {/* Dynamic Category Folder Sorter View */}
        <FolderView
          documents={documents}
          onSelectDocument={(doc) => setSelectedDoc(doc)}
          onOpenEmailModal={(doc) => setEmailDoc(doc)}
          onSyncToDrive={handleSyncToDrive}
          onDeleteDocument={handleDeleteDocument}
        />
      </main>

      {/* Modals & Overlay Drawers */}
      <ScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onDocumentAdded={handleAddDocument}
        netlifyProfiles={netlifyProfiles}
      />

      <NetlifyImporterModal
        isOpen={isNetlifyOpen}
        onClose={() => setIsNetlifyOpen(false)}
        profiles={netlifyProfiles}
        onImportProfiles={handleImportNetlifyProfiles}
      />

      <DriveSyncPanel
        isOpen={isDriveOpen}
        onClose={() => setIsDriveOpen(false)}
        driveConnected={driveConnected}
        userEmail={userDriveEmail}
        onToggleConnect={() => setDriveConnected(!driveConnected)}
        documents={documents}
        onSyncAllDocuments={handleSyncAllDocuments}
      />

      <DocumentViewerModal
        isOpen={!!selectedDoc}
        onClose={() => setSelectedDoc(null)}
        document={selectedDoc}
        onOpenEmailModal={(doc) => {
          setSelectedDoc(null);
          setEmailDoc(doc);
        }}
        onChangeCategory={handleChangeCategory}
        onSyncToDrive={handleSyncToDrive}
      />

      <EmailModal
        isOpen={!!emailDoc}
        onClose={() => setEmailDoc(null)}
        document={emailDoc}
        onSendSuccess={(to) => {
          console.log(`E-mail envoyé avec succès à ${to}`);
        }}
      />

      {/* Floating Scroll to Top Button */}
      <ScrollToTop />

    </div>
  );
}
