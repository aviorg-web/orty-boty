import React from 'react';
import Button from './Button';
import { Topic } from '../types';

interface LearningOptionsProps {
  currentTopic: Topic;
  onSelectOption: (option: 'theory' | 'exercises') => Promise<void>;
  isLoading: boolean;
}

const LearningOptionsComponent: React.FC<LearningOptionsProps> = ({
  currentTopic,
  onSelectOption,
  isLoading,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg shadow-inner text-center">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6 leading-tight">
        נושא <span className="text-blue-600">{currentTopic}</span> נבחר!
      </h2>
      <p className="text-xl text-gray-700 mb-8 max-w-md">
        כיצד תרצה/י ללמוד את הנושא?
      </p>
      <div className="flex flex-col space-y-4 w-full max-w-sm">
        <Button
          onClick={() => onSelectOption('theory')}
          variant="primary"
          className="text-xl py-4"
          disabled={isLoading}
        >
          הסבר לפני תרגול ואחריו מעבר לתרגול
        </Button>
        <Button
          onClick={() => onSelectOption('exercises')}
          variant="secondary"
          className="text-xl py-4"
          disabled={isLoading}
        >
          מעבר לתרגול
        </Button>
      </div>
    </div>
  );
};

export default LearningOptionsComponent;