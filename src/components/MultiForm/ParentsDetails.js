import React, { useEffect } from "react";
import Input from "../Form/Input/Input";

const ParentsDetails = ({
    handleChange,
    handleBlur,
    handleDisabled,
    values,
}) => { 
   
    useEffect(() => {
        handleDisabled(true)
    }, [])

    const parents_fields = {
        mom: [
            {
                id: "name",
                label: "Nome da Mãe",
                class: "input",
                type: "text",
                parent: "mom",
            },
            {
                id: "address",
                label: "Morada",
                class: "input",
                type: "text",
                parent: "mom",
            },
            {
                id: "email",
                label: "E-mail",
                class: "input",
                type: "text",
                parent: "mom",
            },
            {
                id: "contact",
                label: "Contacto",
                class: "input",
                type: "text",
                parent: "mom",
            },
        ],
        dad: [
            {
                id: "name",
                label: "Nome do Pai",
                class: "input",
                type: "text",
                parent: "dad",
            },
            {
                id: "address",
                label: "Morada",
                class: "input",
                type: "text",
                parent: "dad",
            },
            {
                id: "email",
                label: "E-mail",
                class: "input",
                type: "text",
                parent: "dad",
            },
            {
                id: "contact",
                label: "Contacto",
                class: "input",
                type: "text",
                parent: "dad",
            },
        ]
    };
    const form_fields = Object.values(parents_fields).map((parent) =>
        Object.values(parent)
    );

    const handleFormInputChange = (e) => {
        e.preventDefault()
        const formElements = Array.from(e.currentTarget.elements)
        const elementsCount = formElements.length
        const validElements = formElements.filter(element => element.value !== '').length

        if (elementsCount === validElements) {
            handleDisabled(false)
        }

        if (elementsCount !== validElements) {
            handleDisabled(true)
        }
    };

    return (
        <div>
            <form onChange={handleFormInputChange}>
                {form_fields.map((parent) => {
                    return parent.map((field) => {
                        return (
                            <Input
                                key={field.id}
                                id={field.id}
                                parent={field.parent}
                                label={field.label}
                                control={field.type}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                valid={
                                    values[`${field.parent}`][`${field.id}`]
                                        .valid
                                }
                                touched={
                                    values[`${field.parent}`][`${field.id}`]
                                        .touched
                                }
                                value={
                                    values[`${field.parent}`][`${field.id}`]
                                        .value
                                }
                            />
                        );
                    });
                })}
            </form>
        </div>
    );
};

export default ParentsDetails;
