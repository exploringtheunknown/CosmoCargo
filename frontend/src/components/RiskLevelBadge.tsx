import React from 'react';

type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';

interface RiskLevelBadgeProps {
  riskLevel: RiskLevel;
  showQuarantine?: boolean;
  quarantineRequired?: boolean;
}

export default function RiskLevelBadge({ 
  riskLevel, 
  showQuarantine = false, 
  quarantineRequired = false 
}: RiskLevelBadgeProps) {
  let badgeColor = '';
  let emoji = '';
  
  switch (riskLevel) {
    case 'Low':
      badgeColor = 'bg-green-100 text-green-800';
      emoji = '🟢';
      break;
    case 'Medium':
      badgeColor = 'bg-yellow-100 text-yellow-800';
      emoji = '🟡';
      break;
    case 'High':
      badgeColor = 'bg-orange-100 text-orange-800';
      emoji = '🔶';
      break;
    case 'Critical':
      badgeColor = 'bg-red-100 text-red-800';
      emoji = '🔴';
      break;
  }
  
  return (
    <div className="flex flex-col space-y-2">
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeColor}`}>
        {emoji} Risknivå: {riskLevel}
      </span>
      
      {showQuarantine && quarantineRequired && (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          ⚠️ Karantän krävs
        </span>
      )}
    </div>
  );
} 