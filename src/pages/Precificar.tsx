import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { BackIcon } from "../components/icons";
import WizardProgress from "../components/wizard/WizardProgress";
import StepProductName from "../components/wizard/StepProductName";
import StepIngredients from "../components/wizard/StepIngredients";
import StepYield from "../components/wizard/StepYield";
import StepMargin from "../components/wizard/StepMargin";
import StepResult from "../components/wizard/StepResult";
import * as settingsRepository from "../repositories/settingsRepository";
import { parseDecimalInput } from "../utils/format";
import type { RecipeItem } from "../types";

const TOTAL_STEPS = 4;

function getDefaultMarginInput(): string {
  const { defaultProfitMarginPercent } = settingsRepository.get();
  return String(defaultProfitMarginPercent).replace(".", ",");
}

export default function Precificar() {
  const [step, setStep] = useState(1);
  const [productName, setProductName] = useState("");
  const [items, setItems] = useState<RecipeItem[]>([]);
  const [yieldInput, setYieldInput] = useState("");
  const [marginInput, setMarginInput] = useState<string>(getDefaultMarginInput);

  function handleRestart() {
    setStep(1);
    setProductName("");
    setItems([]);
    setYieldInput("");
    setMarginInput(getDefaultMarginInput());
  }

  return (
    <Layout>
      {step < 5 && (
        <>
          <div className="mb-4 flex items-center gap-3">
            {step === 1 ? (
              <Link
                to="/"
                aria-label="Voltar para a Home"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sand/60 text-sageDark active:scale-95"
              >
                <BackIcon className="h-5 w-5" />
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => setStep((current) => current - 1)}
                aria-label="Voltar"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sand/60 text-sageDark active:scale-95"
              >
                <BackIcon className="h-5 w-5" />
              </button>
            )}
            <h2 className="font-display text-xl font-semibold text-sageDark">
              Precificar
            </h2>
          </div>
          <WizardProgress currentStep={step} totalSteps={TOTAL_STEPS} />
        </>
      )}

      {step === 1 && (
        <StepProductName
          productName={productName}
          onChange={setProductName}
          onNext={() => setStep(2)}
        />
      )}

      {step === 2 && (
        <StepIngredients
          items={items}
          onItemsChange={setItems}
          onNext={() => setStep(3)}
        />
      )}

      {step === 3 && (
        <StepYield
          value={yieldInput}
          onChange={setYieldInput}
          onNext={() => setStep(4)}
        />
      )}

      {step === 4 && (
        <StepMargin
          value={marginInput}
          onChange={setMarginInput}
          onNext={() => setStep(5)}
        />
      )}

      {step === 5 && (
        <StepResult
          productName={productName}
          items={items}
          yieldCount={parseDecimalInput(yieldInput)}
          marginPercent={parseDecimalInput(marginInput)}
          onRestart={handleRestart}
        />
      )}
    </Layout>
  );
}
