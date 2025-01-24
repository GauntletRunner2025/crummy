import React from 'react';
import '@/styles/globals.css';

interface GridSlot {
  content: React.ReactNode;
}

interface NineGridLayoutProps {
  topLeft?: GridSlot;
  topCenter?: GridSlot;
  topRight?: GridSlot;
  leftPanel?: GridSlot;
  mainContent?: GridSlot;
  rightPanel?: GridSlot;
  bottomLeft?: GridSlot;
  bottomCenter?: GridSlot;
  bottomRight?: GridSlot;
}

const NineGridLayout: React.FC<NineGridLayoutProps> = ({
  topLeft,
  topCenter,
  topRight,
  leftPanel,
  mainContent,
  rightPanel,
  bottomLeft,
  bottomCenter,
  bottomRight,
}) => {
  return (
    <div className="grid-layout">
      {/* Top Row */}
      <div className="grid-cell grid-cell-top">
        {topLeft?.content}
      </div>
      <div className="grid-cell grid-cell-top">
        {topCenter?.content}
      </div>
      <div className="grid-cell grid-cell-top">
        {topRight?.content}
      </div>
      
      {/* Middle Row */}
      <div className="grid-cell grid-cell-side">
        {leftPanel?.content}
      </div>
      <div className="grid-cell grid-cell-center">
        {mainContent?.content}
      </div>
      <div className="grid-cell grid-cell-side">
        {rightPanel?.content}
      </div>
      
      {/* Bottom Row */}
      <div className="grid-cell grid-cell-bottom">
        {bottomLeft?.content}
      </div>
      <div className="grid-cell grid-cell-bottom">
        {bottomCenter?.content}
      </div>
      <div className="grid-cell grid-cell-bottom">
        {bottomRight?.content}
      </div>
    </div>
  );
};

export default NineGridLayout;
