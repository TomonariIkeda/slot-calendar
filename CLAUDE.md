# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a React TypeScript library for a reservation calendar component. It's designed to be lightweight, accessible, and customizable for booking systems, appointment scheduling, and time slot management.

## Development Commands

### Core Commands
- `npm run build` - Build the library using Rollup
- `npm run dev` - Watch mode for development (alias for build:watch)
- `npm test` - Run Jest tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run type-check` - TypeScript type checking
- `npm run lint` - ESLint checks
- `npm run lint:fix` - Auto-fix ESLint issues
- `npm run format` - Format code with Prettier

### Development Tools
- `npm run storybook` - Start Storybook development server on port 6006
- `npm run build-storybook` - Build Storybook for production
- `npm run size` - Check bundle size limits (15KB limit for both CJS and ESM)

### Quality Gates
- `npm run prepublishOnly` - Runs build, test, and size checks before publishing

## Architecture

### Component Structure
- **ReservationCalendar** - Main calendar component with week view
- **CalendarDay** - Individual day component containing time slots
- **TimeSlot** - Individual time slot component
- **useCalendarState** - Custom hook managing calendar state with useReducer

### State Management
The calendar uses a reducer pattern via `useCalendarState` hook:
- Manages current date, selected date, and selected slots
- Actions: SET_CURRENT_DATE, SET_SELECTED_DATE, TOGGLE_SLOT, CLEAR_SELECTION
- Uses Set for efficient slot selection tracking

### Key Interfaces
- **TimeSlot** - Core slot data structure with id, times, availability, and metadata
- **BusinessHours** - Day-of-week based time constraints
- **ReservationCalendarProps** - Main component props with extensive customization options

### Date Utilities
Located in `src/utils/dateUtils.ts`:
- Week calculation and navigation
- Date comparison and formatting
- Business hours validation
- Time slot creation helpers

## Build System

- **Rollup** - Module bundler with TypeScript plugin
- **PostCSS** - CSS processing with autoprefixer
- **Bundle outputs**: CJS (`dist/index.js`), ESM (`dist/index.esm.js`), Types (`dist/index.d.ts`)
- **CSS export**: `dist/styles.css`

## Testing

- **Jest** with jsdom environment
- **Testing Library** for React component testing
- **Coverage thresholds**: 70% across all metrics (branches, functions, lines, statements)
- Test files: `*.test.{ts,tsx}` (excluded from build)

## Code Quality

- **TypeScript** strict mode enabled
- **ESLint** with React, TypeScript, and Prettier configs
- **Prettier** for code formatting
- **Size limits** enforced via size-limit package

## Package Structure

This is a library package with:
- Peer dependencies: React >=16.8.0, React DOM >=16.8.0
- Exports: Main component, sub-components, hooks, types, and utilities
- CSS styles exported separately for consumer control
- Comprehensive TypeScript definitions

## Key Patterns

1. **Prop-based customization** - Extensive props for styling, behavior, and data
2. **Callback-driven** - onSlotSelect, onSlotDeselect, onDateChange for integration
3. **Accessibility-first** - ARIA labels, keyboard navigation, semantic HTML
4. **Week-based navigation** - Primary UI pattern focuses on weekly views
5. **Metadata support** - TimeSlot metadata field for custom data attachment