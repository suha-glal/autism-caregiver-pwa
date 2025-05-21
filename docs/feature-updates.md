# Autism Caregiver PWA - Updated Features

This document describes the new features added to the Autism Caregiver PWA:

## 1. Label Management

A new "Manage Labels" section has been added to allow caregivers to add or delete emotional/behavioral state labels. This feature provides the following capabilities:

### Adding Labels
- Caregivers can add new custom labels through a simple form
- Labels are global (shared across all users)
- No restrictions on label names
- Duplicate label names are prevented

### Deleting Labels
- Caregivers can delete any label
- Existing logs that use a deleted label will keep that label
- Confirmation is required before deletion

### Implementation Details
- Labels are stored in a dedicated `labels` table in Supabase
- Row Level Security (RLS) policies ensure all authenticated users can view, add, and delete labels
- The logging form dynamically updates to show all available labels

## 2. Error Message Styling

All error messages now appear in red for better visibility:

- Authentication errors (login/signup)
- Label management errors
- Logging form errors
- Sync status errors

## Supabase Schema Updates

A new `labels` table has been added with the following structure:
- `id`: UUID (primary key)
- `name`: TEXT (unique)
- `created_at`: TIMESTAMP

Default labels are pre-populated:
- happy
- sad
- angry
- tantrum
- sleeping

## Security Considerations

The label management feature uses Row Level Security (RLS) policies that:
- Allow all authenticated users to view labels (global read access)
- Allow all authenticated users to add new labels (global write access)
- Allow all authenticated users to delete labels (global delete access)

## User Interface Changes

- A new tab navigation has been added to switch between "Log Entry" and "Manage Labels"
- The logging form now dynamically loads labels from the database
- Error messages are styled in red for better visibility
- Confirmation dialogs prevent accidental label deletion
