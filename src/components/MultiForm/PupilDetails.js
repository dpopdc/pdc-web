import React, { useEffect } from "react";
import Input from "../Form/Input/Input";

const PupilDetails = ({ handleChange, handleBlur, handleDisabled, values }) => {
    useEffect(() => {
        handleDisabled(true)
    }, [])

    const form_fields = [
        {
            id: "group", label: "Grupo Catequese", class: "input", type: "select", options: [
                { value: '0', label: 'Selecione uma opção...'},
                { value: "1", label: "1º ano" },
                { value: "2", label: "2º ano" },
                { value: "3", label: "3º ano" },
                { value: "4", label: "4º ano" },
                { value: "5", label: "5º ano" },
                { value: "6", label: "6º ano" },
                { value: "7", label: "7º ano" },
                { value: "8", label: "8º ano" },
                { value: "9", label: "9º ano" },
                { value: "10", label: "10º ano" },
                { value: "11", label: "Grupo de Jovens" },
            ]
        },
        { id: "name", label: "Nome", class: "input", type: "text" },
        {
            id: "birthDate",
            label: "Data Nascimento",
            class: "input",
            type: "date",
        },
        { id: "address", label: "Morada", class: "input", type: "text", description: 'máx 60 caracteres', settings: {maxLength: '60'}},
        {
            id: "baptismDate",
            label: "Data Batismo",
            class: "input",
            type: "date",
        },
        {
            id: "baptismParish",
            label: "Paróquia de Batismo",
            class: "input",
            type: "text",
        },
        {
            id: "baptismDiocese",
            label: "Diocese de Batismo",
            class: "input",
            type: "text",
        },
    ];

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
    }

    return (
        <div>
            <form onChange={handleFormInputChange}>
                {form_fields.map((field) => {
                    return (
                        <Input
                            key={field.id}
                            id={field.id}
                            label={field.label}
                            control={field.type}
                            options={field.options}
                            description={field.description}
                            settings={field.settings}

                            onChange={handleChange}
                            onBlur={handleBlur}
                            valid={values[`${field.id}`].valid}
                            touched={values[`${field.id}`].touched}
                            value={values[`${field.id}`].value}
                        />
                    );
                })}
            </form>
        </div>
    );
};

export default PupilDetails;
