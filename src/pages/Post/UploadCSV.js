import React, { Component } from "react";
import Error from "../../components/Error";
import API from "../../api/api";
import authHeader from "../../services/auth-header.service";

export default class UploadCSV extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errors: {},
            csvFile: null
        };

        this.handleCSV = this.handleCSV.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleCSV(event) {
        event.preventDefault();
        this.setState({
            csvFile: event.target.files[0]
        });
    }

    handleSubmit(event) {
        event.preventDefault();

        this.setState({
            errors: {}
        });

        const formData = new FormData();
        formData.append("csv_file", this.state.csvFile);
        API.post("posts/upload-csv", formData, {
            headers: {
                ...authHeader(),
                "Content-Type": "multipart/form-data"
            }
        })
            .then(res => {
                if (res.data.success) {
                    this.props.history.push("/post");
                }
            })
            .catch(error => {
                if (error.response) {
                    console.error(error.response.data);
                    if (error.response.status == 422) {
                        this.setState({
                            errors: Object.values(error.response.data.errors)
                        });
                    }
                }
            });
    }

    render() {
        return (
            <div className="sub-container">
                <h2>Upload CSV</h2>
                <div className="mb-3">
                    <Error errors={this.state.errors} />
                </div>
                <form>
                    <div className="row mb-3 mx-0">
                        <input
                            type="file"
                            accept=".csv"
                            className="form-control"
                            onChange={event => this.handleCSV(event)}
                            required
                        />
                    </div>
                    <div className="row mb-3 mx-0">
                        <button
                            type="submit"
                            className="btn btn-primary"
                            onClick={this.handleSubmit}
                        >
                            Upload
                        </button>
                        <button type="reset" className="btn btn-secondary">
                            Reset
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}
