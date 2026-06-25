import { useCallback, useEffect, useState } from 'react';

import { advanceTurn, updateAssignment } from '@/game/engine/advanceTurn';
import { createInitialState } from '@/game/models/createInitialState';
import {
  clearGameState,
  loadGameState,
  saveGameState,
} from '@/lib/storage/gameStorage';
import type { GameState, LogCategory, ScheduleType } from '@/types/game';

interface UseGameSessionResult {
  state: GameState;
  selectedRequestId: string | null;
  isSummaryOpen: boolean;
  validationMessage: string | null;
  handleSelectRequest: (requestId: string | null) => void;
  handleAssignSchedule: (
    staffId: string,
    scheduleType: ScheduleType,
    requestInstanceId?: string,
  ) => void;
  handleAdvanceTurn: () => void;
  handleCloseSummary: () => void;
  handleNewGame: () => void;
  handleResetSave: () => void;
  handleToggleNarrativeSpeed: () => void;
}

export const useGameSession = (): UseGameSessionResult => {
  const [state, setState] = useState<GameState>(() => {
    return loadGameState() ?? createInitialState(1);
  });
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);

  useEffect(() => {
    saveGameState(state);
  }, [state]);

  const handleSelectRequest = useCallback((requestId: string | null) => {
    setSelectedRequestId(requestId);
  }, []);

  const handleAssignSchedule = useCallback(
    (staffId: string, scheduleType: ScheduleType, requestInstanceId?: string) => {
      setState((previous) => {
        return updateAssignment(previous, staffId, scheduleType, requestInstanceId);
      });
      setValidationMessage(null);
    },
    [],
  );

  const handleAdvanceTurn = useCallback(() => {
    setState((previous) => {
      const result = advanceTurn(previous);

      if (!result.ok) {
        setValidationMessage(result.error);
        setIsSummaryOpen(false);

        return previous;
      }

      setValidationMessage(null);
      setIsSummaryOpen(true);

      return result.state;
    });
  }, []);

  const handleCloseSummary = useCallback(() => {
    setIsSummaryOpen(false);
  }, []);

  const handleNewGame = useCallback(() => {
    const nextPlaythrough = state.playthrough + 1;
    const freshState = createInitialState(nextPlaythrough);
    setState(freshState);
    setSelectedRequestId(null);
    setIsSummaryOpen(false);
    setValidationMessage(null);
    saveGameState(freshState);
  }, [state.playthrough]);

  const handleResetSave = useCallback(() => {
    clearGameState();
    const freshState = createInitialState(1);
    setState(freshState);
    setSelectedRequestId(null);
    setIsSummaryOpen(false);
    setValidationMessage(null);
  }, []);

  const handleToggleNarrativeSpeed = useCallback(() => {
    setState((previous) => {
      if (previous.playthrough < 2) {
        return previous;
      }

      return {
        ...previous,
        settings: {
          ...previous.settings,
          narrativeSpeed:
            previous.settings.narrativeSpeed === 'sequential'
              ? 'instant'
              : 'sequential',
        },
      };
    });
  }, []);

  return {
    state,
    selectedRequestId,
    isSummaryOpen,
    validationMessage,
    handleSelectRequest,
    handleAssignSchedule,
    handleAdvanceTurn,
    handleCloseSummary,
    handleNewGame,
    handleResetSave,
    handleToggleNarrativeSpeed,
  };
};

export type { LogCategory };
