
import React, { createContext, useContext } from 'react';
import { PostItem } from '../components/pages/HomeFeed';

// Define the types of modals available
export type ModalType = 
    | 'logout'
    | 'askQuestion'
    | 'shareProject'
    | 'writeArticle'
    | 'share'
    | 'send';

// Define the props that can be passed to modals
export interface ModalProps {
    post?: PostItem;
    onPostQuestion?: (data: { question: string; details: string; tags: string }) => void;
    onShareProject?: (data: { title: string; description: string; link: string; }) => void;
    onWriteArticle?: (data: { title: string; content: string; }) => void;
    onConfirmLogout?: () => void;
}

// Define the context shape
interface IModalContext {
    type: ModalType | null;
    props: ModalProps;
    openModal: (type: ModalType, props?: ModalProps) => void;
    closeModal: () => void;
    setModalProps: (newProps: ModalProps) => void;
}

// Create the context
export const ModalContext = createContext<IModalContext>({
    type: null,
    props: {},
    openModal: () => {},
    closeModal: () => {},
    setModalProps: () => {},
});

// Create a custom hook for easy access
export const useModal = () => useContext(ModalContext);
