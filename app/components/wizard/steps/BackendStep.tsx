"use client"

import { BackendProvider, backendOptions, defaultBackendConfig } from "@/app/lib/config/schema"
import { OptionTile } from "@/app/components/wizard/OptionTile"
import { StepGrid, StepPanel, StepSection } from "@/app/components/wizard/StepPanel"
import { ToggleRow } from "@/app/components/wizard/ToggleRow"
import { useWizard } from "@/app/lib/state/useWizardStore"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { RadioGroup } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"

export function BackendStep() {
    const { config, updateConfig, setSelectedItem } = useWizard()

    const handleProviderChange = (provider: BackendProvider) => {
        const updates: Record<string, unknown> = {
            backend: defaultBackendConfig(provider),
        }

        if (provider === "custom") {
            if (!config.misc.usesDio && !config.misc.usesHttp) {
                updates.misc = {
                    ...config.misc,
                    usesDio: true,
                }
            }
        }

        updateConfig(updates)
    }

    const backend = config.backend

    const toggleOption = (key: string, value: boolean | string) => {
        if (backend.provider === "none") return
        const options = {
            ...(backend as { options?: Record<string, unknown> }).options,
            [key]: value,
        }
        updateConfig({ backend: { ...backend, options } as typeof backend })
    }

    const options = (backend as { options?: Record<string, boolean | string> }).options ?? {}

    return (
        <StepPanel
            title="Backend & auth"
            description="Choose a backend provider, then enable the services your scaffold should wire up."
        >
            <StepSection title="Provider">
                <RadioGroup
                    value={backend.provider}
                    onValueChange={(value) => handleProviderChange(value as BackendProvider)}
                    className="w-full"
                >
                    <StepGrid cols={3}>
                        {backendOptions.map((option) => (
                            <OptionTile
                                key={option.value}
                                value={option.value}
                                label={option.label}
                                description={option.description}
                                selected={backend.provider === option.value}
                                onInfo={() => setSelectedItem(option.value)}
                            />
                        ))}
                    </StepGrid>
                </RadioGroup>
            </StepSection>

            {backend.provider !== "none" ? (
                <>
                    <Separator />
                    <StepSection
                        title="Integrations"
                        description="Toggle the packages and auth flows to include."
                    >
                        {backend.provider === "firebase" ? (
                            <StepGrid cols={2}>
                                <ToggleRow
                                    label="Email auth"
                                    infoKey="firebase_auth_email"
                                    checked={Boolean(options.authEmail)}
                                    onCheckedChange={(value) => toggleOption("authEmail", value)}
                                />
                                <ToggleRow
                                    label="Google auth"
                                    infoKey="firebase_auth_google"
                                    checked={Boolean(options.authGoogle)}
                                    onCheckedChange={(value) => toggleOption("authGoogle", value)}
                                />
                                <ToggleRow
                                    label="Phone auth"
                                    infoKey="firebase_auth_phone"
                                    checked={Boolean(options.authPhone)}
                                    onCheckedChange={(value) => toggleOption("authPhone", value)}
                                />
                                <ToggleRow
                                    label="Firestore"
                                    infoKey="firebase_firestore"
                                    checked={Boolean(options.firestore)}
                                    onCheckedChange={(value) => toggleOption("firestore", value)}
                                />
                                <ToggleRow
                                    label="Realtime DB"
                                    infoKey="firebase_realtime_db"
                                    checked={Boolean(options.realtimeDb)}
                                    onCheckedChange={(value) => toggleOption("realtimeDb", value)}
                                />
                                <ToggleRow
                                    label="Storage"
                                    infoKey="firebase_storage"
                                    checked={Boolean(options.storage)}
                                    onCheckedChange={(value) => toggleOption("storage", value)}
                                />
                                <ToggleRow
                                    label="Analytics"
                                    infoKey="firebase_analytics"
                                    checked={Boolean(options.analytics)}
                                    onCheckedChange={(value) => toggleOption("analytics", value)}
                                />
                                <ToggleRow
                                    label="Crashlytics"
                                    infoKey="firebase_crashlytics"
                                    checked={Boolean(options.crashlytics)}
                                    onCheckedChange={(value) => toggleOption("crashlytics", value)}
                                />
                            </StepGrid>
                        ) : null}

                        {backend.provider === "supabase" ? (
                            <StepGrid cols={3}>
                                <ToggleRow
                                    label="Auth"
                                    infoKey="supabase_auth"
                                    checked={Boolean(options.auth)}
                                    onCheckedChange={(value) => toggleOption("auth", value)}
                                />
                                <ToggleRow
                                    label="Database"
                                    infoKey="supabase_database"
                                    checked={Boolean(options.database)}
                                    onCheckedChange={(value) => toggleOption("database", value)}
                                />
                                <ToggleRow
                                    label="Edge functions"
                                    infoKey="supabase_edge_functions"
                                    checked={Boolean(options.edgeFunctions)}
                                    onCheckedChange={(value) =>
                                        toggleOption("edgeFunctions", value)
                                    }
                                />
                            </StepGrid>
                        ) : null}

                        {backend.provider === "appwrite" ? (
                            <StepGrid cols={3}>
                                <ToggleRow
                                    label="Auth"
                                    infoKey="appwrite_auth"
                                    checked={Boolean(options.auth)}
                                    onCheckedChange={(value) => toggleOption("auth", value)}
                                />
                                <ToggleRow
                                    label="Database"
                                    infoKey="appwrite_database"
                                    checked={Boolean(options.database)}
                                    onCheckedChange={(value) => toggleOption("database", value)}
                                />
                                <ToggleRow
                                    label="Storage"
                                    infoKey="appwrite_storage"
                                    checked={Boolean(options.storage)}
                                    onCheckedChange={(value) => toggleOption("storage", value)}
                                />
                            </StepGrid>
                        ) : null}

                        {backend.provider === "custom" ? (
                            <Field className="max-w-xl">
                                <FieldLabel htmlFor="baseUrl">Base URL</FieldLabel>
                                <Input
                                    id="baseUrl"
                                    placeholder="https://api.example.com"
                                    value={String(options.baseUrl ?? "")}
                                    onChange={(e) => toggleOption("baseUrl", e.target.value)}
                                />
                            </Field>
                        ) : null}
                    </StepSection>
                </>
            ) : null}
        </StepPanel>
    )
}
