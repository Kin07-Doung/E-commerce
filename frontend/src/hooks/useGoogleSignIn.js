import { useEffect, useRef } from 'react';

let isGoogleInitialized = false;
let currentCallback = null;

export const useGoogleSignIn = (callback, buttonId) => {
  const containerIdRef = useRef(buttonId);
  containerIdRef.current = buttonId;

  useEffect(() => {
    currentCallback = callback;
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!googleClientId) return;

    const renderButton = () => {
      if (!window.google || !containerIdRef.current) return;
      const buttonContainer = document.getElementById(containerIdRef.current);
      if (!buttonContainer) return;
      buttonContainer.innerHTML = '';
      window.google.accounts.id.renderButton(buttonContainer, {
        theme: 'outline',
        size: 'large'
      });
    };

    if (isGoogleInitialized) {
      renderButton();
      return;
    }

    if (!window.google) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);

      script.onload = () => {
        if (!window.google || isGoogleInitialized) return;
        isGoogleInitialized = true;
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: async (response) => {
            if (currentCallback) {
              await currentCallback(response.credential);
            }
          }
        });
        renderButton();
      };

      return () => {
        script.onload = null;
      };
    }

    if (!isGoogleInitialized) {
      isGoogleInitialized = true;
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: async (response) => {
          if (currentCallback) {
            await currentCallback(response.credential);
          }
        }
      });
      renderButton();
    }
  }, [callback]);
};
