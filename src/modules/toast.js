import { useToast } from 'vue-toastification'

const toast = useToast({
    position: 'top-center',
    timeout: 2000,
    pauseOnHover: false,
    pauseOnFocusLost: false,
    hideProgressBar: true,
});

export default toast;