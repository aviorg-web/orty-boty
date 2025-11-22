import React from 'react';
import Button from './Button';
import { Topic } from '../types';
import { TOPICS } from '../constants';

interface TopicSelectorProps {
  onSelectTopic: (topic: Topic) => void;
}

const TopicSelector: React.FC<TopicSelectorProps> = ({ onSelectTopic }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg shadow-inner">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">בחר/י נושא ללמוד ולתרגל:</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-2xl">
        {TOPICS.map((topic) => (
          <Button
            key={topic}
            onClick={() => onSelectTopic(topic)}
            variant="secondary"
            className="w-full text-xl py-4 transition-transform transform hover:scale-105"
          >
            {topic}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default TopicSelector;