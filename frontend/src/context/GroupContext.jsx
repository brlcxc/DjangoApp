import React, { createContext, useState, useEffect } from 'react';
import api from '../api';

export const GroupContext = createContext();

const GroupProvider = ({ children }) => {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchGroups = async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/groups/');
            setGroups(response.data);
        } catch (error) {
            console.error('Error fetching groups:', error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGroups();
    }, []);

    const deleteGroup = async (groupId) => {
        try {
            await api.delete(`/api/groups/${groupId}/`);
            setGroups((prevGroups) => prevGroups.filter((group) => group.group_id !== groupId));
            console.log(`Group ${groupId} deleted successfully.`);
        } catch (error) {
            console.error(`Failed to delete group ${groupId}:`, error);
            setError(error);
        }
    };

    const addGroup = async (newGroup) => {
        try {
            const response = await api.post('/api/groups/', newGroup, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setGroups((prevGroups) => [...prevGroups, response.data]);
        } catch (error) {
            console.error('Failed to add group:', error);
            setError(error);
        }
    };

    // Note: It would be ideal to later take in a list of user ID to use one GET request
    const addMember = async (groupId, memberId) => {
        try {
            const response = await api.post(`/api/groups/${groupId}/add_member/`, { member_id: memberId });
            setGroups((prevGroups) =>
                prevGroups.map((group) =>
                    group.group_id === groupId ? { ...group, members: response.data.members } : group
                )
            );
            console.log(`Member ${memberId} added to group ${groupId}.`);
        } catch (error) {
            console.error(`Failed to add member to group ${groupId}:`, error);
            setError(error);
        }
    };

    const removeMember = async (groupId, memberId) => {
        try {
            const response = await api.post(`/api/groups/${groupId}/remove_member/`, { member_id: memberId });
            setGroups((prevGroups) =>
                prevGroups.map((group) =>
                    group.group_id === groupId ? { ...group, members: response.data.members } : group
                )
            );
            console.log(`Member ${memberId} removed from group ${groupId}.`);
        } catch (error) {
            console.error(`Failed to remove member from group ${groupId}:`, error);
            setError(error);
        }
    };

    const contextValue = {
        groups,
        loading,
        error,
        addGroup,
        deleteGroup,
        addMember,
        removeMember,
    };

    return (
        <GroupContext.Provider value={contextValue}>
            {children}
        </GroupContext.Provider>
    );
};

export { GroupProvider };