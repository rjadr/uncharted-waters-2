import React from 'react';
import MessageBox from '../common/MessageBox';
import { discoveryData, discoveryCategories, type DiscoveryId } from '../../data/discoveryData';
import { dismissDiscovery } from '../../state/actionsDiscovery';

interface Props {
  discoveryId: DiscoveryId;
}

export default function Discovery({ discoveryId }: Props) {
  const d = discoveryData[discoveryId];
  const categoryName = discoveryCategories[d.categoryId];

  return (
    <div className="absolute inset-0 flex items-center justify-center z-50">
      <div className="w-[640px]">
        <MessageBox>
          <div className="px-6 py-4">
            <div className="text-center text-xs mb-1" style={{ color: '#006030' }}>
              {categoryName}
            </div>
            <div className="text-center text-xl mb-3" style={{ color: '#8b2000' }}>
              {d.name}
            </div>
            <div className="text-sm leading-relaxed mb-4" style={{ color: '#3a1800' }}>
              {d.description}
            </div>
            <div className="text-xs text-center" style={{ color: '#605030' }}>
              Added to cargo. Present to a researcher for adventure fame.
            </div>
            <div className="flex justify-center mt-4">
              <button
                className="px-8 py-1 text-sm"
                style={{
                  background: '#c07030',
                  color: '#fff8e8',
                  border: '2px solid #7a3800',
                  cursor: 'pointer',
                }}
                onClick={dismissDiscovery}
              >
                OK
              </button>
            </div>
          </div>
        </MessageBox>
      </div>
    </div>
  );
}
