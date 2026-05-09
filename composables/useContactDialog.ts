export function useContactDialog() {
    const isOpen = useState('contact-dialog-open', () => false);

    function open() {
        isOpen.value = true;
    }

    function close() {
        isOpen.value = false;
    }

    return {
        isOpen,
        open,
        close,
    };
}
