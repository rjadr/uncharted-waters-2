/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import React, { ReactNode, useState } from 'react';

import BuildingWrapper from '../BuildingWrapper';
import BuildingMenu from '../../common/BuildingMenu';
import MessageBox from '../../common/MessageBox';
import InputNumber from '../../common/InputNumber';
import useBuilding from '../hooks/useBuilding';
import useCancel from '../hooks/useCancel';
import { VendorMessageBoxType } from '../../quest/getMessageBoxes';
import {
  getMarketBuyPrice,
  getMarketSellPrice,
  buyGood,
  sellGood,
} from '../../../state/actionsPort';
import {
  getTotalFreeCapacity,
  getTotalFleetCapacity,
  getTotalCargoUsed,
  getGoodQuantity,
  getAllGoods,
} from '../../../state/selectorsFleet';
import { getGold } from '../../../state/selectors';
import { goodData, getBuyPrice, type GoodId } from '../../../data/marketData';
import { getPortData } from '../../../game/port/portUtils';
import state from '../../../state/state';

const marketOptions = ['Buy', 'Sell', 'Status'] as const;
type MarketOption = typeof marketOptions[number];

// Goods available to buy at the current port (price > 0)
function getAvailableGoods(): GoodId[] {
  if (!state.portId) return [];
  const port = getPortData(state.portId);
  if (port.isSupplyPort) return [];
  return (Object.keys(goodData) as GoodId[]).filter(
    (id) => getBuyPrice(id, port.marketId) > 0,
  );
}

// ─── Quantity input overlay ───────────────────────────────────────────────────

interface GoodInputProps {
  goodId: GoodId;
  mode: 'buy' | 'sell';
  onComplete: () => void;
  onCancel: () => void;
}

function GoodInput({ goodId, mode, onComplete, onCancel }: GoodInputProps) {
  const good = goodData[goodId];
  const price =
    mode === 'buy' ? getMarketBuyPrice(goodId) : getMarketSellPrice(goodId);
  const limit =
    mode === 'buy'
      ? Math.min(getTotalFreeCapacity(), Math.floor(getGold() / price))
      : getGoodQuantity(goodId);

  useCancel(onCancel);

  return (
    <div className="absolute bottom-[80px] left-[80px]">
      <MessageBox>
        <div className="w-[480px] px-4 py-2 text-2xl">
          {mode === 'buy'
            ? `${good.name} costs ${price} gold per unit. How many will you buy?`
            : `${good.name} fetches ${price} gold per unit. How many will you sell?`}
          <InputNumber
            limit={limit}
            onComplete={(quantity) => {
              if (quantity > 0) {
                if (mode === 'buy') buyGood(goodId, quantity);
                else sellGood(goodId, quantity);
              }
              onComplete();
            }}
            onCancel={onCancel}
            inlined
          />
        </div>
      </MessageBox>
    </div>
  );
}

// ─── Cargo status panel ───────────────────────────────────────────────────────

interface StatusPanelProps {
  back: () => void;
}

function StatusPanel({ back }: StatusPanelProps) {
  useCancel(back);
  const goods = getAllGoods();
  const used = getTotalCargoUsed();
  const capacity = getTotalFleetCapacity();

  return (
    <div className="absolute top-[48px] left-[16px]">
      <MessageBox>
        <div className="px-4 py-2 w-[600px]">
          <div className="flex text-green-600 mb-2">
            <span className="flex-1">Good</span>
            <span className="w-24 text-right">Qty</span>
            <span className="w-32 text-right">Sell price</span>
          </div>
          {goods.length === 0 && (
            <div className="text-2xl text-gray-400">No trade goods in hold.</div>
          )}
          {goods.map(({ goodId, quantity }) => (
            <div key={goodId} className="flex text-2xl mt-1">
              <span className="flex-1">{goodData[goodId].name}</span>
              <span className="w-24 text-right">{quantity}</span>
              <span className="w-32 text-right text-[#d34100]">
                {getMarketSellPrice(goodId)}g
              </span>
            </div>
          ))}
          <div className="mt-4 pt-2 border-t border-gray-600 text-2xl">
            Cargo: {used} / {capacity}
          </div>
        </div>
      </MessageBox>
    </div>
  );
}

// ─── Goods list panel ─────────────────────────────────────────────────────────

interface GoodsListProps {
  mode: 'buy' | 'sell';
  onSelect: (goodId: GoodId) => void;
  back: () => void;
}

function GoodsList({ mode, onSelect, back }: GoodsListProps) {
  useCancel(back);

  const goods =
    mode === 'buy'
      ? getAvailableGoods()
      : getAllGoods().map(({ goodId }) => goodId);

  const freeSpace = getTotalFreeCapacity();

  if (goods.length === 0) {
    return (
      <div className="absolute top-[48px] left-[16px]">
        <MessageBox>
          <div className="px-4 py-3 text-2xl w-[400px]">
            {mode === 'buy'
              ? 'We have nothing to offer right now.'
              : 'You have no trade goods to sell.'}
          </div>
        </MessageBox>
      </div>
    );
  }

  return (
    <div className="absolute top-[48px] left-[16px]">
      <MessageBox>
        <div className="px-4 py-2 w-[640px]">
          <div className="flex text-green-600 mb-2 text-2xl">
            <span className="flex-1">Good</span>
            <span className="w-28 text-right">
              {mode === 'buy' ? 'Buy' : 'Sell'} price
            </span>
            {mode === 'buy' && (
              <span className="w-24 text-right">Available</span>
            )}
            {mode === 'sell' && (
              <span className="w-24 text-right">Held</span>
            )}
          </div>
          {goods.map((goodId) => {
            const price =
              mode === 'buy'
                ? getMarketBuyPrice(goodId)
                : getMarketSellPrice(goodId);
            const qty =
              mode === 'buy' ? freeSpace : getGoodQuantity(goodId);
            const disabled = mode === 'buy' && freeSpace === 0;

            return (
              <div
                key={goodId}
                className={`flex text-2xl mt-1 ${
                  disabled
                    ? 'text-gray-500'
                    : 'cursor-pointer hover:text-[#f3a261]'
                }`}
                onClick={() => !disabled && onSelect(goodId)}
              >
                <span className="flex-1">{goodData[goodId].name}</span>
                <span className="w-28 text-right text-[#d34100]">{price}g</span>
                <span className="w-24 text-right">{qty}</span>
              </div>
            );
          })}
          {mode === 'buy' && (
            <div className="mt-3 pt-2 border-t border-gray-600 text-2xl">
              Free cargo space: {freeSpace}
            </div>
          )}
        </div>
      </MessageBox>
    </div>
  );
}

// ─── Main Market component ────────────────────────────────────────────────────

export default function Market() {
  const { selectOption, back, state: buildingState } = useBuilding<MarketOption>();
  const [selectedGood, setSelectedGood] = useState<GoodId | null>(null);

  const { option } = buildingState;

  let vendorMessage: VendorMessageBoxType = {
    body: 'Welcome to the market. What would you like to do?',
  };

  const menu: ReactNode = (
    <BuildingMenu
      options={marketOptions.map((s) => ({ label: s, value: s }))}
      onSelect={(s) => selectOption(s)}
      onCancel={back}
      hidden={option !== null}
    />
  );

  let children: ReactNode = null;

  if (option === 'Buy') {
    if (!getGold()) {
      vendorMessage = {
        body: "You don't have any gold.",
        acknowledge: back,
      };
    } else if (getTotalFreeCapacity() === 0) {
      vendorMessage = {
        body: 'Your ships are fully loaded.',
        acknowledge: back,
      };
    } else {
      vendorMessage = { body: "What would you like to buy?" };

      if (selectedGood) {
        children = (
          <GoodInput
            goodId={selectedGood}
            mode="buy"
            onComplete={() => setSelectedGood(null)}
            onCancel={() => setSelectedGood(null)}
          />
        );
      } else {
        children = (
          <GoodsList
            mode="buy"
            onSelect={(id) => setSelectedGood(id)}
            back={back}
          />
        );
      }
    }
  }

  if (option === 'Sell') {
    const held = getAllGoods();
    if (!held.length) {
      vendorMessage = {
        body: "You don't have any trade goods to sell.",
        acknowledge: back,
      };
    } else {
      vendorMessage = { body: "What would you like to sell?" };

      if (selectedGood) {
        children = (
          <GoodInput
            goodId={selectedGood}
            mode="sell"
            onComplete={() => setSelectedGood(null)}
            onCancel={() => setSelectedGood(null)}
          />
        );
      } else {
        children = (
          <GoodsList
            mode="sell"
            onSelect={(id) => setSelectedGood(id)}
            back={back}
          />
        );
      }
    }
  }

  if (option === 'Status') {
    vendorMessage = { body: "Here's what you're carrying." };
    children = <StatusPanel back={back} />;
  }

  return (
    <BuildingWrapper
      buildingId="1"
      vendorMessageBox={vendorMessage}
      menu={menu}
    >
      {children}
    </BuildingWrapper>
  );
}
