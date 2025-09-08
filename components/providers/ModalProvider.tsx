
import React, { useState, useCallback } from 'react';
import { ModalContext, ModalType, ModalProps } from '../../contexts/ModalContext';

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [modalState, setModalState] = useState<{ type: ModalType | null, props: ModalProps }>({
        type: null,
        props: {},
    });

    const openModal = useCallback((type: ModalType, props: ModalProps = {}) => {
        setModalState({ type, props });
    }, []);

    const closeModal = useCallback(() => {
        setModalState({ type: null, props: {} });
    }, []);

    // This allows components to set callbacks for modals to use, like onPostQuestion
    const setModalProps = useCallback((newProps: ModalProps) => {
        setModalState(prevState => ({
            ...prevState,
            props: { ...prevState.props, ...newProps }
        }));
    }, []);
    

    return (
        <ModalContext.Provider value={{ ...modalState, openModal, closeModal, setModalProps }}>
            {children}
        </ModalContext.Provider>
    );
};
