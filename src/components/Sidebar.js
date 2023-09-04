import {
    Box,
    Button,
    Drawer,
    DrawerOverlay,
    DrawerCloseButton,
    DrawerHeader,
    DrawerBody,
    DrawerContent,
    VStack,
} from '@chakra-ui/react';
import { toggleSidebarVisibility } from '../store/componentSlice';
import { useDispatch, useSelector } from 'react-redux';

const SidebarContent = ({ onClick }) => (
    <VStack>
        <Button onClick={onClick} w="100%">
            Read about DLCs
        </Button>
        <Button onClick={onClick} w="100%">
            Read about Smart Contracts
        </Button>
        <Button onClick={onClick} w="100%">
            Read about Router Wallets
        </Button>
    </VStack>
);

const Sidebar = () => {
    const isSidebarOpen = useSelector((state) => state.component.isSidebarOpen);
    const dispatch = useDispatch();
    return (
        <Drawer
            isOpen={isSidebarOpen}
            placement="left"
            onClose={() => dispatch(toggleSidebarVisibility())}
        >
            <DrawerOverlay>
                <DrawerContent
                    backgroundColor={'background2'}
                    border={'1px solid #07E8D8'}
                >
                    <DrawerCloseButton />
                    <DrawerHeader>Chakra-UI</DrawerHeader>
                    <DrawerBody>
                        <SidebarContent
                            onClick={() => dispatch(toggleSidebarVisibility())}
                        />
                    </DrawerBody>
                </DrawerContent>
            </DrawerOverlay>
        </Drawer>
    );
};

export default Sidebar;
