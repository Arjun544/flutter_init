"use client"

import { ThemePreset } from "@/app/lib/config/schema"
import { useWizard } from "@/app/lib/state/useWizardStore"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { StepFooter } from "../StepFooter"

export function ThemeStep() {
    const { config, updateConfig, next, prev } = useWizard()
    const { theme } = config

    return (
        <Card className="border-border/40 bg-background/60 shadow-xl backdrop-blur-xl transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
            <CardHeader>
                <CardTitle className="bg-linear-to-br from-foreground to-muted-foreground bg-clip-text text-transparent text-xl font-bold">UI & Theme</CardTitle>
                <CardDescription>
                    Choose your design system, dark mode, and fonts.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2 group">
                        <Label className="transition-colors group-focus-within:text-primary">Theme</Label>
                        <Select
                            value={theme.preset}
                            onValueChange={(value) =>
                                updateConfig({ theme: { ...theme, preset: value as ThemePreset } })
                            }
                        >
                            <SelectTrigger className="w-full bg-background/50 backdrop-blur-sm transition-all focus:ring-2 focus:ring-primary/20 hover:border-primary/40">
                                <SelectValue placeholder="Select theme" />
                            </SelectTrigger>
                            <SelectContent className="bg-background/90 backdrop-blur-xl border-border/50">
                                <SelectItem value="material3">Material 3</SelectItem>
                                <SelectItem value="cupertino">Cupertino</SelectItem>
                                <SelectItem value="custom">Custom</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2 group">
                        <Label htmlFor="primaryColor" className="transition-colors group-focus-within:text-primary">Primary color</Label>
                        <div className="flex items-center gap-3">
                            <div className="relative flex-1">
                                <Input
                                    id="primaryColor"
                                    value={theme.primaryColor ?? ""}
                                    onChange={(e) =>
                                        updateConfig({ theme: { ...theme, primaryColor: e.target.value } })
                                    }
                                    placeholder="#6750A4"
                                    className="pl-10 font-mono bg-background/50 backdrop-blur-sm transition-all focus:ring-2 focus:ring-primary/20"
                                />
                                <div
                                    className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border border-border"
                                    style={{ backgroundColor: theme.primaryColor ?? "#6750A4" }}
                                />
                            </div>
                            <Input
                                type="color"
                                className="h-10 w-16 p-1 cursor-pointer hover:scale-105 transition-transform"
                                value={theme.primaryColor ?? "#6750A4"}
                                onChange={(e) =>
                                    updateConfig({ theme: { ...theme, primaryColor: e.target.value } })
                                }
                            />
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4 rounded-xl border border-border/40 bg-card/30 p-5 backdrop-blur-sm transition-all hover:bg-card/50 hover:border-primary/20 click-scale">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-semibold text-foreground/90">Dark mode</p>
                                <p className="text-sm text-muted-foreground">
                                    Support system and manual toggle.
                                </p>
                            </div>
                            <Switch
                                checked={theme.darkMode.enabled}
                                onCheckedChange={(checked) =>
                                    updateConfig({ theme: { ...theme, darkMode: { ...theme.darkMode, enabled: checked } } })
                                }
                                className="data-[state=checked]:bg-primary"
                            />
                        </div>
                        <div className={`flex items-center justify-between transition-opacity duration-300 ${!theme.darkMode.enabled ? 'opacity-50 pointer-events-none' : ''}`}>
                            <p className="text-sm text-muted-foreground">Follow system</p>
                            <Switch
                                checked={theme.darkMode.system}
                                onCheckedChange={(checked) =>
                                    updateConfig({ theme: { ...theme, darkMode: { ...theme.darkMode, system: checked } } })
                                }
                                disabled={!theme.darkMode.enabled}
                            />
                        </div>
                    </div>

                    <div className="space-y-4 rounded-xl border border-border/40 bg-card/30 p-5 backdrop-blur-sm transition-all hover:bg-card/50 hover:border-primary/20 click-scale">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="font-semibold text-foreground/90">Font</p>
                                <p className="text-sm text-muted-foreground">
                                    Use default or a Google Font.
                                </p>
                            </div>
                            <Select
                                value={theme.font.choice}
                                onValueChange={(value) =>
                                    updateConfig({ theme: { ...theme, font: { ...theme.font, choice: value as "default" | "google" } } })
                                }
                            >
                                <SelectTrigger className="w-36 bg-background/50 backdrop-blur-sm border-border/60">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-background/90 backdrop-blur-xl">
                                    <SelectItem value="default">Default</SelectItem>
                                    <SelectItem value="google">Google Fonts</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className={`space-y-2 transition-all duration-300 overflow-hidden ${theme.font.choice === 'google' ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
                            <Label htmlFor="fontFamily" className="text-sm text-muted-foreground">Font family</Label>
                            <Input
                                id="fontFamily"
                                value={theme.font.family ?? ""}
                                onChange={(e) =>
                                    updateConfig({
                                        theme: { ...theme, font: { ...theme.font, family: e.target.value } },
                                    })
                                }
                                placeholder="e.g. Inter"
                                className="bg-background/50 backdrop-blur-sm"
                            />
                        </div>
                    </div>
                </div>
            </CardContent>
            <StepFooter onPrev={prev} onNext={next} />
        </Card>
    )
}
