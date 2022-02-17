import React, { useRef } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import * as Yup from 'yup';
import * as actionAuth from '../../store/actions/auth/actionAuth';
import { Form } from '@unform/web';
import Input from '../../component/form/Input';
import imgLogin from '../../img/ioasys.png';
import books from '../../img/books.png';

import './Login.css';
import axios from "axios";


const Login = (props) => {
    const formRef = useRef(null);

    async function LoginAcess(user, pass) {
        try {
            let webApiUrlPost = 'https://books.ioasys.com.br/api/v1/auth/sign-in';

            let resp = await axios.post(webApiUrlPost, {
                email: user,
                password: pass
            });
            return resp;
        } catch (error) {
            alert('Usuário invalido!')
            console.log('error', error)
        }
    }

    async function GetData(token) {
        // let webApiUrlGet = 'https://books.ioasys.com.br/api/v1/books?page=1&amount=20&category=biographies';
        let webApiUrlGetTotal = 'https://books.ioasys.com.br/api/v1/books?page=1&amount=20';
        try {
            axios.get(webApiUrlGetTotal, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            })
                .then(
                    respget => {
                        props.setDadosLibrary(respget.data);
                    }
                );
        } catch (err) {
            console.log('error get', err)
        };
    }

    async function handleSubmit(data, { reset }) {
        try {
            const schema = Yup.object().shape({
                user: Yup.string().required('Nome usuario é obrigatorio.'),
                password: Yup.string().required('A senha é obrigatoria.'),
            });

            await schema.validate(data, {
                abortEarly: false,
            })

            const dadosLogin = await LoginAcess(data.user, data.password);
            if (dadosLogin.status === 200) {
                await GetData(dadosLogin.headers.authorization);
                props.loginUser(dadosLogin);
            }
            reset();
        } catch (err) {
            if (err instanceof Yup.ValidationError) {
                const errorMessager = {};

                err.inner.forEach(error => {
                    errorMessager[error.path] = error.message;
                })

                formRef.current.setErrors(errorMessager);
            }
        }
    }

    return (
        <div className='login'>
            <Form className='container' onSubmit={handleSubmit} ref={formRef}>
                <div className='header'>
                    <img src={imgLogin} className="imgLogin" alt="imgLogin" />
                    <img src={books} className="imgLogin" alt="books" />
                </div>
                <div className='body'>
                /* email: "desafio@ioasys.com.br",
                    password: "12341234" */
                    <Input className="inputUser" name="user" placeholder="Email" />
                    <Input type="password" name="password" placeholder="senha" />
                    <button type="submit" >Login</button>
                </div>
            </Form>
        </div>
    )
}

function mapStateToProps(state) {
    return {
        auth: state.auth,
    };
}

const mapDispatchToProp = (dispatch) => bindActionCreators(actionAuth, dispatch)

export default connect(
    mapStateToProps,
    mapDispatchToProp
)(Login);