import React from 'react';

const OptionsApp: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Extension Options
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Configure your extension settings here.
          </p>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Options page will be fully implemented in Phase 6 (User Story 4).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptionsApp;
