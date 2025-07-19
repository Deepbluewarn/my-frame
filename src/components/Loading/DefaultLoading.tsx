// 
import Styles from '@/styles/components/Loading/DefaultLoading.module.css';
import { Box, Loader } from "@mantine/core";

export default function DefaultLoading() {
    return (
        <Box className={Styles.container}>
            <Loader color="gray" size="xl" type="dots" />
        </Box>
    )
}
