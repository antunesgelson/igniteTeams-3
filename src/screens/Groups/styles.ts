import styled from 'styled-components/native';

import { SafeAreaView } from 'react-native-safe-area-context';


export const Container = styled(SafeAreaView)`
flex: 1;
background-color: ${({ theme }) => theme.COLORS.GRAY_600};
padding: 80px 20px 0px 20px;

`;



export const Title = styled.Text`
color: #FFF;
font-size: 32px;
`