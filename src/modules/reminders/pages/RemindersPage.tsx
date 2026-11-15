import { useState } from "react";
import { Link } from "react-router";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PageContainer, PageHeader } from "@/components/custom";
import { paths } from "@/modules/core/routes/paths/path";
import { AlertsMasterSwitch } from "@/modules/reminders/components/AlertsMasterSwitch";
import { NotificationHistory } from "@/modules/reminders/components/NotificationHistory";
import { ReminderRuleCard } from "@/modules/reminders/components/ReminderRuleCard";
import { UpcomingReminders } from "@/modules/reminders/components/UpcomingReminders";
import {
  INITIAL_RULES,
  MOCK_NOTIFICATIONS,
  MOCK_UPCOMING_REMINDERS,
  type ReminderCategory,
  type ReminderRule,
} from "@/modules/reminders/data/mockReminders";

const CATEGORIES: ReminderCategory[] = ["task", "exam", "class"];

function CountChip({ value }: { value: number }) {
  return (
    <span className="ml-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-none bg-muted px-1 text-[10px] font-semibold text-muted-foreground">
      {value}
    </span>
  );
}

export default function RemindersPage() {
  // Estado local solo para poder revisar el diseño de los interruptores.
  const [allEnabled, setAllEnabled] = useState(true);
  const [rules, setRules] = useState(INITIAL_RULES);

  const updateRule = (
    category: ReminderCategory,
    patch: Partial<ReminderRule>,
  ) =>
    setRules((prev) => ({
      ...prev,
      [category]: { ...prev[category], ...patch },
    }));

  const unread = MOCK_NOTIFICATIONS.filter((n) => !n.read).length;

  return (
    <PageContainer size="md">
        <PageHeader
          title="Recordatorios y avisos"
          description={`${MOCK_UPCOMING_REMINDERS.length} avisos programados · ${unread} sin leer`}
          actions={
            <Button size="sm">
              <Plus className="size-3.5" />
              Nuevo recordatorio
            </Button>
          }
        />

        <AlertsMasterSwitch enabled={allEnabled} onChange={setAllEnabled} />

        <Tabs defaultValue="upcoming">
          <TabsList
            variant="line"
            className="h-auto w-full justify-start rounded-none border-b border-border pb-0"
          >
            <TabsTrigger value="upcoming" className="relative pb-3">
              Próximos
              <CountChip value={MOCK_UPCOMING_REMINDERS.length} />
            </TabsTrigger>
            <TabsTrigger value="rules" className="relative pb-3">
              Anticipación
            </TabsTrigger>
            <TabsTrigger value="history" className="relative pb-3">
              Historial
              {unread > 0 && <CountChip value={unread} />}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="mt-4">
            <UpcomingReminders
              reminders={MOCK_UPCOMING_REMINDERS}
              disabled={!allEnabled}
            />
          </TabsContent>

          <TabsContent value="rules" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {CATEGORIES.map((category) => (
                <ReminderRuleCard
                  key={category}
                  category={category}
                  rule={rules[category]}
                  disabled={!allEnabled}
                  onToggle={(enabled) => updateRule(category, { enabled })}
                  onLeadTimeChange={(leadTime) =>
                    updateRule(category, { leadTime })
                  }
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              El correo de resumen y los sonidos se ajustan en{" "}
              <Link
                to={paths.settings}
                className="font-medium text-foreground underline underline-offset-4"
              >
                Configuración
              </Link>
              .
            </p>
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            <NotificationHistory entries={MOCK_NOTIFICATIONS} />
          </TabsContent>
        </Tabs>
      </PageContainer>
  );
}
