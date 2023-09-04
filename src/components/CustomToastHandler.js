import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { deleteToastEvent } from '../store/vaultsSlice';
import { useCustomToast } from '../hooks/useCustomToast';
import { useSelector } from 'react-redux';

export default function CustomToastHandler() {
    const dispatch = useDispatch();
    const toastEvent = useSelector((state) => state.vaults.toastEvent);
    const handleCustomToast = useCustomToast();

    useEffect(() => {
        if (!toastEvent) return;
        handleCustomToast(toastEvent);
        dispatch(deleteToastEvent());
    }, [toastEvent]);
}
