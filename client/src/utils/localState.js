import { useState } from 'react';


const useLocalState = () => {
    const [alert, setAlert] = useState({
        show: false,
        text: '',
        type : 'danger', 
    })

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const showLocalAlert = ({ text, type = 'danger' }) => {
        setAlert({show : true, text, type})
    }
    const hideLocalAlert = () => {
        setAlert({ show: false, text: '', type: 'danger' });
    }

    return {
        alert,
        showLocalAlert,
        loading,
        setLoading,
        success,
        setSuccess,
        hideLocalAlert,
    }
}

export default useLocalState;