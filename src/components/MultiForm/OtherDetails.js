import React, { useEffect } from "react";
import Input from "../Form/Input/Input";

const OtherDetails = ({
    handleChange,
    handleBlur,
    handleDisabled,
    values,
}) => {

    useEffect(() => {
        handleDisabled(true)
    }, [])

    const form_fields = [
        {
            id: "details",
            label: "Observações",
            description:
                "(neste espaço registo algum pormenor que considere importante para o acompanhamento do Catequizando ou relacionado com a catequese)",
            type: "textarea",
            parent: "other"
        },
        {
            id: "catechism",
            label:
                "Contribuição para as despesas associadas à catequese e catecismo",
            type: "select",
            options: [
                { value: '', label: 'Selecione uma opção...' },
                { value: "yes", label: "Pretendo Adequirir o Catecismo" },
                { value: "no", label: "Não Pretendo Adequirir o Catecismo" },
            ],
            parent: "other"
        },
        {
            id: "guardian",
            label: "Encarregado de Educação",
            type: "select",
            options: [
                { value: '', label: 'Selecione uma opção...' },
                { value: "mom", label: "Pretendo que seja a Mãe a Encarregada de Educação" },
                { value: "dad", label: "Pretendo que seja o Pai o Encarregado de Educação" },
            ],
            parent: "other"
        }
    ];

    console.log(values)

    const handleFormInputChange = (e) => {
        const formElements = Array.from(e.currentTarget.elements)
        const elementsCount = formElements.length - 1
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
                            parent={field.parent}
                            label={field.label}
                            description={field.description}
                            options={field.options}
                            control={field.type}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            valid={values[`${field.parent}`][`${field.id}`].valid}
                            touched={values[`${field.parent}`][`${field.id}`].touched}
                            value={values[`${field.parent}`][`${field.id}`].value}
                        />
                    );
                })}
            </form>
        </div>
    );
};

export default OtherDetails;
