import React, { Component } from "react";
import API from "../../api/api";
import authHeader from "../../services/auth-header.service";
import Loading from "../../components/Loading";
import UserForm from "../../components/UserForm";

export default class Edit extends Component {
    constructor(props) {
        super(props);

        this._isMounted = false;

        this.id = this.props.match.params.id;

        this.state = {
            loading: false,
            initialValues: {
                name: "",
                email: "",
                password: "",
                cPassword: "",
                type: 1,
                phone: "",
                dateOfBirth: "",
                address: ""
            },
            selectedFile: null,
            imagePreviewUrl: null
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleProfile = this.handleProfile.bind(this);
        this.fetchUser = this.fetchUser.bind(this);
    }

    fetchUser() {
        if (this._isMounted) {
            this.setState({ loading: true });
        }
        API.get("users/" + this.id, {
            headers: authHeader()
        })
            .then(res => {
                console.log(res);
                const {
                    name,
                    email,
                    type,
                    phone,
                    birth_date: dateOfBirth,
                    address
                } = res.data.user;
                if (this._isMounted) {
                    this.setState({
                        initialValues: {
                            name,
                            email,
                            type,
                            phone,
                            dateOfBirth,
                            address
                        }
                    });
                }
            })
            .then(() => {
                if (this._isMounted) this.setState({ loading: false });
            });
    }

    handleProfile(event) {
        this.setState(
            {
                selectedFile: event.target.files[0]
            },
            () => console.log(this.state.selectedFile)
        );

        let reader = new FileReader();
        let file = event.target.files[0];
        reader.onloadend = () => {
            this.setState({
                imagePreviewUrl: reader.result
            });
        };
        reader.readAsDataURL(file);
    }

    handleSubmit(values) {
        const formData = new FormData();
        formData.append("_method", "PUT");
        formData.append("id", this.id);
        formData.append("name", values.name);
        formData.append("email", values.email);
        formData.append("type", values.type);
        formData.append("phone", values.phone);
        formData.append("birth_date", values.dateOfBirth);
        formData.append("address", values.address);
        formData.append("image", this.state.selectedFile);

        API.post("users", formData, {
            headers: {
                ...authHeader(),
                "Content-Type": "multipart/form-data"
            }
        })
            .then(() => {
                this.props.history.push("/user");
            })
            .catch(error => {
                if (error.response) {
                    console.log(error.response.data);
                }
            });
    }

    componentDidMount() {
        this._isMounted = true;
        this.fetchUser();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        const loading = this.state.loading;

        if (loading) {
            return <Loading />;
        }

        return (
            <div className="sub-container">
                <h2>Edit User</h2>
                <UserForm
                    formMode={"edit"}
                    initialValues={this.state.initialValues}
                    imagePreviewUrl={this.state.imagePreviewUrl}
                    handleSubmit={this.handleSubmit}
                    handleProfile={this.handleProfile}
                />
            </div>
        );
    }
}
