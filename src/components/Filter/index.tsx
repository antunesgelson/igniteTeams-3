import { TouchableOpacityProps } from 'react-native';

import { Container, FilterStyleProps, Title } from './styles';

type Props = TouchableOpacityProps & FilterStyleProps & {
    title: string
}


export function Filter({ title, isAtive = false, ...rest }: Props) {
    return (

        <Container
            isAtive={isAtive}
            {...rest}
        >


            <Title>
                {title}
            </Title>
        </Container>
    )
}
