import React from "react";
import { useFormik } from "formik";

/**
 * A custom validation function. This must return an object
 * which keys are symmetrical to our values/initialValues
 * @param {object} values
 * @return {object} errors
 */
const validate = values => {
    const errors = {};
    if (!values.title) {
        errors.title = "Required";
    } else if (values.title.length > 255) {
        errors.title = "Must be 255 characters or less";
    }

    if (!values.description) {
        errors.description = "Required";
    } else if (values.description.length > 255) {
        errors.description = "Must be 255 characters or less";
    }

    return errors;
};

const PostForm = ({ formMode, initialValues, handleSubmit }) => {
    // Pass the useFormik() hook initial form values and a submit function that will
    // be called when the form is submitted
    const formik = useFormik({
        initialValues,
        validate,
        onSubmit: values => {
            handleSubmit(values);
        }
    });
    return (
        <form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
            <div className="row mb-3">
                <label htmlFor="title" className="form-label">
                    Title
                </label>
                <input
                    id="title"
                    name="title"
                    type="text"
                    className="form-control"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.title}
                />
                <div className="txt-error">
                    {formik.touched.title && formik.errors.title
                        ? formik.errors.title
                        : null}
                </div>
            </div>

            <div className="row mb-3">
                <label htmlFor="description" className="form-label">
                    Description
                </label>
                <textarea
                    id="description"
                    name="description"
                    rows="3"
                    className="form-control"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.description}
                />
                <div className="txt-error">
                    {formik.touched.description && formik.errors.description
                        ? formik.errors.description
                        : null}
                </div>
            </div>

            <div className="row d-flex justify-content-around">
                <button type="submit" className="btn btn-primary">
                    {formMode == "create" ? "Create" : "Update"}
                </button>
                <button type="reset" className="btn btn-secondary">
                    Reset
                </button>
            </div>
        </form>
    );
};

export default PostForm;
