import { useSelector } from 'react-redux';
import DepositModal from './DepositModal';
import SelectWalletModal from './SelectWalletModal';
import InfoModal from './InfoModal';

export default function ModalContainer() {
    const isDepositModalOpen = useSelector(
        (state) => state.component.isDepositModalOpen
    );
    const isInfoModalOpen = useSelector(
        (state) => state.component.isInfoModalOpen
    );
    const isSelectWalletModalOpen = useSelector(
        (state) => state.component.isSelectWalletModalOpen
    );

    return (
        <>
            {isDepositModalOpen && <DepositModal />}
            {isInfoModalOpen && <InfoModal />}
            {isSelectWalletModalOpen && <SelectWalletModal />}
        </>
    );
}
