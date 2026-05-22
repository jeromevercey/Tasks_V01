// Notifications slide-over panels for Add Schedule modal
// 3 artboards: Invitations, Completion, Reminders
// Each artboard shows: main modal (left, dimmed) + slide-over (right, active)

const C = {
  // Color tokens derived from the reference jpg
  pageBg: '#4a5362',          // dark slate behind the modal
  modalBg: '#ffffff',
  text: '#0f1729',
  textMuted: '#64748b',
  textLight: '#94a3b8',
  border: '#e2e8f0',
  borderStrong: '#cbd5e1',
  sectionBg: '#f8fafc',
  rowBg: '#f8fafc',
  blue: '#2563eb',
  blueLight: '#eff6ff',
  blueSoft: '#dbeafe',
  danger: '#ef4444',
  green: '#16a34a',
  // sketchy mode derives from these via --sketchy var
};

// ------- Sketchy wrapper (applies a hand-drawn feel via CSS filter/font)
// In sketchy mode: swap font to a "hand" stack, add slight rotation jitter to
// cards, and roughen borders with a wavy SVG filter.
const SKETCHY_CSS = `
.sketchy-on {
  font-family: 'Kalam', 'Caveat', 'Comic Sans MS', 'Segoe Print', cursive !important;
}
.sketchy-on .nf-card,
.sketchy-on .nf-modal,
.sketchy-on .nf-slideover,
.sketchy-on .nf-input,
.sketchy-on .nf-btn,
.sketchy-on .nf-chip,
.sketchy-on .nf-toggle,
.sketchy-on .nf-tab,
.sketchy-on .nf-avatar {
  filter: url(#sketchy-filter);
}
.sketchy-on .nf-input,
.sketchy-on .nf-btn,
.sketchy-on .nf-card,
.sketchy-on .nf-chip {
  border-radius: 4px !important;
}
`;

const SketchyFilter = () => (
  <svg width="0" height="0" style={{ position: 'absolute' }}>
    <defs>
      <filter id="sketchy-filter">
        <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="5" />
        <feDisplacementMap in="SourceGraphic" scale="1.2" />
      </filter>
    </defs>
  </svg>
);

// ------- Atoms -----------------------------------------------------------

const Icon = ({ name, size = 16, color = 'currentColor', strokeWidth = 1.8 }) => {
  const paths = {
    close: <path d="M4 4l12 12M16 4L4 16" />,
    calendar: <><rect x="3" y="4" width="14" height="13" rx="2" /><path d="M3 8h14M7 2v4M13 2v4" /></>,
    bell: <><path d="M5 8a5 5 0 0110 0v3l1.5 3h-13L5 11V8z" /><path d="M8 16a2 2 0 004 0" /></>,
    mail: <><rect x="2" y="4" width="16" height="12" rx="1.5" /><path d="M2 6l8 5 8-5" /></>,
    check2: <><circle cx="10" cy="10" r="7" /><path d="M7 10l2 2 4-4" /></>,
    alarm: <><circle cx="10" cy="11" r="6" /><path d="M10 7v4l2 2M4 5l2-2M16 5l-2-2" /></>,
    plus: <path d="M10 4v12M4 10h12" />,
    chevDown: <path d="M5 8l5 5 5-5" />,
    sms: <><path d="M3 4h14v10H9l-4 3v-3H3V4z" /></>,
    user: <><circle cx="10" cy="7" r="3" /><path d="M4 17a6 6 0 0112 0" /></>,
    users: <><circle cx="7" cy="7" r="3" /><path d="M2 17a5 5 0 0110 0" /><path d="M13 5a3 3 0 010 6M18 17a5 5 0 00-4-5" /></>,
    trash: <><path d="M4 6h12M8 6V4h4v2M6 6l1 11h6l1-11" /></>,
    edit: <><path d="M14 3l3 3-9 9H5v-3l9-9z" /></>,
    clock: <><circle cx="10" cy="10" r="7" /><path d="M10 6v4l3 2" /></>,
    send: <><path d="M3 10l14-6-6 14-2-6-6-2z" /></>,
    launch: <><path d="M3 3h6v2H5v10h10v-4h2v6H3V3z" /><path d="M11 3h6v6l-2-2-5 5-2-2 5-5-2-2z" /></>,
    info: <><circle cx="10" cy="10" r="7" /><path d="M10 9v5M10 6.5v.5" /></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
};

const SectionHeader = ({ icon, title }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
    <div className="nf-card" style={{ width: 28, height: 28, borderRadius: 999, background: C.blueLight, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.blue }}>
      <Icon name={icon} size={15} />
    </div>
    <div style={{ fontSize: 11, fontWeight: 600, color: C.blue, letterSpacing: 1.2, textTransform: 'uppercase' }}>{title}</div>
  </div>
);

const Label = ({ children, required }) => (
  <div style={{ fontSize: 12.5, fontWeight: 600, color: C.text, marginBottom: 6 }}>
    {children} {required && <span style={{ color: C.danger }}>*</span>}
  </div>
);

const Input = ({ placeholder, value, style = {}, suffix }) => (
  <div className="nf-input" style={{ height: 36, padding: '0 12px', border: `1px solid ${C.border}`, borderRadius: 6, background: '#fff', display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: value ? C.text : C.textLight, ...style }}>
    <span style={{ flex: 1 }}>{value || placeholder}</span>
    {suffix}
  </div>
);

const Toggle = ({ on, color = C.blue, size = 'md' }) => {
  const w = size === 'sm' ? 30 : 36;
  const h = size === 'sm' ? 17 : 20;
  const d = size === 'sm' ? 13 : 16;
  return (
    <div className="nf-toggle" style={{ width: w, height: h, borderRadius: h / 2, background: on ? color : '#cbd5e1', position: 'relative', transition: 'background .15s', flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: 2, left: on ? w - d - 2 : 2, width: d, height: d, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,.15)', transition: 'left .15s' }} />
    </div>
  );
};

const Btn = ({ children, variant = 'default', icon, style = {}, size = 'md' }) => {
  const styles = {
    primary: { background: C.blue, color: '#fff', border: 'none' },
    default: { background: '#fff', color: C.text, border: `1px solid ${C.border}` },
    ghost: { background: 'transparent', color: C.text, border: 'none' },
    subtle: { background: C.sectionBg, color: C.text, border: `1px solid ${C.border}` },
  };
  const pad = size === 'sm' ? '6px 10px' : '8px 14px';
  const fs = size === 'sm' ? 11.5 : 12.5;
  return (
    <button className="nf-btn" style={{ padding: pad, borderRadius: 999, fontSize: fs, fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer', ...styles[variant], ...style }}>
      {icon && <Icon name={icon} size={13} />}
      {children}
    </button>
  );
};

// ------- The main (left) modal — collapsed/dimmed ------------------------

const MainModal = ({ activeNotif, configured }) => {
  const notifRow = (id, icon, title, desc) => {
    const isActive = id === activeNotif;
    const cfg = configured[id];
    return (
      <div className="nf-card" style={{
        background: isActive ? '#fff' : C.rowBg,
        border: `1px solid ${isActive ? C.blueSoft : C.border}`,
        borderRadius: 8,
        padding: '12px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        boxShadow: isActive ? `0 0 0 2px ${C.blueLight}` : 'none',
      }}>
        <div style={{ width: 28, height: 28, borderRadius: 6, background: isActive ? C.blueLight : '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isActive ? C.blue : C.textMuted }}>
          <Icon name={icon} size={14} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{title}</div>
          <div style={{ fontSize: 11.5, color: C.textMuted, marginTop: 1 }}>{cfg || desc}</div>
        </div>
        {cfg ? (
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <div style={{ fontSize: 10.5, fontWeight: 600, color: C.green, background: '#dcfce7', padding: '3px 8px', borderRadius: 999, letterSpacing: 0.3, textTransform: 'uppercase' }}>Active</div>
            <Btn size="sm" variant="ghost" icon="edit" style={{ padding: '5px 8px', color: C.textMuted }}>Edit</Btn>
          </div>
        ) : (
          <Btn size="sm" icon="plus">Setup Now</Btn>
        )}
      </div>
    );
  };

  return (
    <div className="nf-modal" style={{
      width: 440,
      background: '#fff',
      borderRadius: 10,
      boxShadow: '0 10px 40px rgba(0,0,0,.18)',
      overflow: 'hidden',
      fontFamily: 'Inter, -apple-system, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      maxHeight: 760,
    }}>
      {/* header */}
      <div style={{ padding: '18px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>Add New Schedule</div>
        <div style={{ color: C.textMuted, cursor: 'pointer' }}><Icon name="close" size={16} /></div>
      </div>

      {/* body */}
      <div style={{ padding: '18px 22px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 22 }}>
        <div>
          <SectionHeader icon="calendar" title="Schedule Information" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 88px', gap: 12, marginBottom: 14 }}>
            <div>
              <Label required>Schedule name</Label>
              <Input value="Fall Semester 2025" />
            </div>
            <div>
              <Label required>Priority</Label>
              <Input value="1" suffix={<Icon name="chevDown" size={13} color={C.textMuted} />} />
            </div>
          </div>
          <Label required>Date Configuration</Label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
            <div className="nf-card" style={{ padding: '10px 12px', border: `1.5px solid ${C.blue}`, borderRadius: 6, background: C.blueLight }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.blue }}>Fixed Dates</div>
              <div style={{ fontSize: 10.5, color: C.textMuted, marginTop: 2 }}>Specific start and end dates</div>
            </div>
            <div className="nf-card" style={{ padding: '10px 12px', border: `1px solid ${C.border}`, borderRadius: 6 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.text }}>Relative Dates</div>
              <div style={{ fontSize: 10.5, color: C.textMuted, marginTop: 2 }}>Based on a specific condition</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Input value="2025-09-02" suffix={<Icon name="calendar" size={13} color={C.textMuted} />} />
            <Input value="2025-12-19" suffix={<Icon name="calendar" size={13} color={C.textMuted} />} />
          </div>
        </div>

        <div>
          <SectionHeader icon="bell" title="Notifications" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {notifRow('invitations', 'mail', 'Invitations', 'Send notifications when users are invited to participate')}
            {notifRow('completion', 'check2', 'Completion', 'Send notifications when tasks are completed')}
            {notifRow('reminders', 'alarm', 'Reminders', 'Send notifications before deadlines')}
          </div>
        </div>
      </div>

      {/* footer */}
      <div style={{ padding: '14px 22px', borderTop: `1px solid ${C.border}`, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <Btn>Cancel</Btn>
        <Btn variant="primary">Create</Btn>
      </div>
    </div>
  );
};

// ------- Slide-over shell ------------------------------------------------

const SlideOver = ({ title, subtitle, icon, enabled, onToggle, children, footer }) => (
  <div className="nf-slideover" style={{
    width: 420,
    background: '#fff',
    borderRadius: 10,
    boxShadow: '0 10px 40px rgba(0,0,0,.25), 0 0 0 1px rgba(0,0,0,.04)',
    overflow: 'hidden',
    fontFamily: 'Inter, -apple-system, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    maxHeight: 760,
  }}>
    {/* header */}
    <div style={{ padding: '18px 22px', borderBottom: `1px solid ${C.border}` }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: C.blueLight, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.blue }}>
            <Icon name={icon} size={16} />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{title}</div>
            <div style={{ fontSize: 11.5, color: C.textMuted, marginTop: 1 }}>{subtitle}</div>
          </div>
        </div>
        <div style={{ color: C.textMuted, cursor: 'pointer' }}><Icon name="close" size={16} /></div>
      </div>

      {/* Master toggle */}
      <div className="nf-card" style={{
        background: enabled ? C.blueLight : C.sectionBg,
        border: `1px solid ${enabled ? C.blueSoft : C.border}`,
        borderRadius: 8,
        padding: '10px 12px',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <Toggle on={enabled} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: C.text }}>
            {enabled ? 'Enabled' : 'Disabled'}
          </div>
          <div style={{ fontSize: 11, color: C.textMuted }}>
            {enabled ? 'This notification will be sent' : 'Turn on to configure'}
          </div>
        </div>
      </div>
    </div>

    {/* body */}
    <div style={{ padding: '18px 22px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 20, opacity: enabled ? 1 : 0.55, pointerEvents: enabled ? 'auto' : 'none' }}>
      {children}
    </div>

    {/* footer */}
    <div style={{ padding: '14px 22px', borderTop: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
      <Btn variant="ghost" style={{ color: C.textMuted, padding: '6px 0' }}>Cancel</Btn>
      <div style={{ display: 'flex', gap: 8 }}>
        {footer}
      </div>
    </div>
  </div>
);

// ------- Reusable — channel picker (Email + SMS toggles) -----------------

const ChannelPicker = ({ emailOn = true, smsOn = false }) => (
  <div>
    <Label>Delivery Channels</Label>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* Email */}
      <div className="nf-card" style={{
        border: `1px solid ${emailOn ? C.blueSoft : C.border}`,
        background: emailOn ? C.blueLight : '#fff',
        borderRadius: 8, padding: '10px 12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: emailOn ? 10 : 0 }}>
          <div style={{ width: 26, height: 26, borderRadius: 6, background: emailOn ? '#fff' : C.sectionBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: emailOn ? C.blue : C.textMuted }}>
            <Icon name="mail" size={13} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: C.text }}>Email</div>
            <div style={{ fontSize: 11, color: C.textMuted }}>Send via email to recipients</div>
          </div>
          <Toggle on={emailOn} size="sm" />
        </div>
        {emailOn && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div>
              <div style={{ fontSize: 10.5, color: C.textMuted, marginBottom: 3, fontWeight: 500 }}>From</div>
              <Input value="noreply@org.com" style={{ height: 30, fontSize: 11.5, background: '#fff' }} />
            </div>
            <div>
              <div style={{ fontSize: 10.5, color: C.textMuted, marginBottom: 3, fontWeight: 500 }}>Reply-to</div>
              <Input value="admin@org.com" style={{ height: 30, fontSize: 11.5, background: '#fff' }} />
            </div>
          </div>
        )}
      </div>

      {/* SMS */}
      <div className="nf-card" style={{
        border: `1px solid ${smsOn ? C.blueSoft : C.border}`,
        background: smsOn ? C.blueLight : '#fff',
        borderRadius: 8, padding: '10px 12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 26, height: 26, borderRadius: 6, background: smsOn ? '#fff' : C.sectionBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: smsOn ? C.blue : C.textMuted }}>
            <Icon name="sms" size={13} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: C.text }}>SMS</div>
            <div style={{ fontSize: 11, color: C.textMuted }}>Send text messages to mobile numbers</div>
          </div>
          <Toggle on={smsOn} size="sm" />
        </div>
      </div>
    </div>
  </div>
);

// ------- Template editor -------------------------------------------------

const TemplateEditor = ({ subject, body, showSubject = true, vars = [] }) => (
  <div>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
      <Label>Message Template</Label>
      <div style={{ fontSize: 10.5, color: C.blue, fontWeight: 500, cursor: 'pointer' }}>Reset to default</div>
    </div>
    <div className="nf-card" style={{ border: `1px solid ${C.border}`, borderRadius: 6, background: '#fff', overflow: 'hidden' }}>
      {showSubject && (
        <div style={{ padding: '8px 12px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 10.5, color: C.textMuted, fontWeight: 500, minWidth: 42 }}>Subject</span>
          <span style={{ fontSize: 12, color: C.text, flex: 1 }}>{subject}</span>
        </div>
      )}
      <div style={{ padding: '10px 12px', fontSize: 12, lineHeight: 1.6, color: C.text, whiteSpace: 'pre-wrap', minHeight: 86 }}>
        {body}
      </div>
      <div style={{ padding: '6px 10px', borderTop: `1px solid ${C.border}`, background: C.sectionBg, display: 'flex', gap: 5, flexWrap: 'wrap' }}>
        {vars.map((v) => (
          <span key={v} className="nf-chip" style={{ fontSize: 10.5, padding: '2px 7px', borderRadius: 4, background: '#fff', border: `1px solid ${C.border}`, color: C.textMuted, fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}>
            {'{{'}{v}{'}}'}
          </span>
        ))}
      </div>
    </div>
  </div>
);

// ------- Invitations slide-over -----------------------------------------

const InvitationsPanel = () => (
  <SlideOver
    title="Invitations"
    subtitle="Send notifications when users are invited to participate"
    icon="mail"
    enabled={true}
    footer={<><Btn>Save draft</Btn><Btn variant="primary">Save</Btn></>}
  >
    <ChannelPicker emailOn={true} smsOn={true} />

    {/* Recipients / roles */}
    <div>
      <Label>Recipients</Label>
      <div className="nf-card" style={{ border: `1px solid ${C.border}`, borderRadius: 8, background: '#fff', padding: 10 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            { name: 'Students', count: 234, role: 'Participant' },
            { name: 'Teaching Assistants', count: 12, role: 'Moderator' },
            { name: 'Dr. Martinez', count: 1, role: 'Owner', solo: true },
          ].map((r) => (
            <div key={r.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 8px', background: C.sectionBg, borderRadius: 6 }}>
              <div className="nf-avatar" style={{ width: 24, height: 24, borderRadius: r.solo ? '50%' : 5, background: r.solo ? '#fde68a' : C.blueLight, color: r.solo ? '#92400e' : C.blue, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={r.solo ? 'user' : 'users'} size={12} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{r.name}</div>
                <div style={{ fontSize: 10.5, color: C.textMuted }}>{r.count} {r.count > 1 ? 'members' : 'member'} · {r.role}</div>
              </div>
              <Icon name="trash" size={12} color={C.textLight} />
            </div>
          ))}
          <Btn variant="subtle" icon="plus" size="sm" style={{ justifyContent: 'center', marginTop: 2 }}>
            Add recipient or role
          </Btn>
        </div>
      </div>
    </div>

    <TemplateEditor
      subject="You're invited to {{schedule_name}}"
      body={`Hi {{first_name}},\n\nYou've been invited to participate in {{schedule_name}}, starting {{start_date}}. Click below to accept.`}
      vars={['first_name', 'schedule_name', 'start_date', 'invite_link']}
    />

    <div>
      <Label>Send timing</Label>
      <div style={{ display: 'flex', gap: 8 }}>
        <div className="nf-card" style={{ flex: 1, padding: '10px 12px', border: `1.5px solid ${C.blue}`, borderRadius: 6, background: C.blueLight }}>
          <div style={{ fontSize: 11.5, fontWeight: 600, color: C.blue }}>Immediate</div>
          <div style={{ fontSize: 10.5, color: C.textMuted, marginTop: 2 }}>When schedule is created</div>
        </div>
        <div className="nf-card" style={{ flex: 1, padding: '10px 12px', border: `1px solid ${C.border}`, borderRadius: 6 }}>
          <div style={{ fontSize: 11.5, fontWeight: 600, color: C.text }}>Scheduled</div>
          <div style={{ fontSize: 10.5, color: C.textMuted, marginTop: 2 }}>Pick a specific date</div>
        </div>
      </div>
    </div>
  </SlideOver>
);

// ------- Completion slide-over ------------------------------------------

const CompletionPanel = () => (
  <SlideOver
    title="Completion"
    subtitle="Send notifications when tasks are completed"
    icon="check2"
    enabled={true}
    footer={<><Btn>Save draft</Btn><Btn variant="primary">Save</Btn></>}
  >
    <ChannelPicker emailOn={true} smsOn={false} />

    <TemplateEditor
      subject="{{task_name}} has been completed"
      body={`Good news — {{participant_name}} just completed "{{task_name}}" in {{schedule_name}}.\n\nCompleted on {{completion_date}}.`}
      vars={['participant_name', 'task_name', 'schedule_name', 'completion_date']}
    />

    {/* Preview of what gets sent */}
    <div>
      <Label>Preview</Label>
      <div className="nf-card" style={{ border: `1px solid ${C.border}`, borderRadius: 8, background: C.sectionBg, padding: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingBottom: 8, borderBottom: `1px dashed ${C.border}`, marginBottom: 8 }}>
          <Icon name="mail" size={12} color={C.textMuted} />
          <div style={{ fontSize: 10.5, color: C.textMuted, flex: 1 }}>admin@org.com</div>
          <div style={{ fontSize: 10, color: C.textLight }}>Just now</div>
        </div>
        <div style={{ fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 4 }}>
          Week 3 Reading has been completed
        </div>
        <div style={{ fontSize: 11, color: C.textMuted, lineHeight: 1.5 }}>
          Good news — Alex Kim just completed "Week 3 Reading" in Fall Semester 2025.
        </div>
      </div>
    </div>
  </SlideOver>
);

// ------- Reminders slide-over -------------------------------------------

const ReminderRow = ({ value, unit, first }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <div className="nf-card" style={{ width: 26, height: 26, borderRadius: 6, background: first ? C.blueLight : C.sectionBg, color: first ? C.blue : C.textMuted, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Icon name="alarm" size={12} />
    </div>
    <Input value={value} style={{ width: 70, height: 32 }} />
    <div className="nf-input" style={{ height: 32, padding: '0 10px', border: `1px solid ${C.border}`, borderRadius: 6, background: '#fff', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: C.text, minWidth: 90 }}>
      <span style={{ flex: 1 }}>{unit}</span>
      <Icon name="chevDown" size={11} color={C.textMuted} />
    </div>
    <div style={{ fontSize: 11.5, color: C.textMuted, flex: 1 }}>before deadline</div>
    <div style={{ color: C.textLight, cursor: 'pointer', padding: 4 }}>
      <Icon name="trash" size={13} />
    </div>
  </div>
);

const RemindersPanel = () => (
  <SlideOver
    title="Reminders"
    subtitle="Send notifications before deadlines"
    icon="alarm"
    enabled={true}
    footer={<><Btn>Save draft</Btn><Btn variant="primary">Save</Btn></>}
  >
    <ChannelPicker emailOn={true} smsOn={true} />

    {/* Reminder sequence */}
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <Label>Reminder Schedule</Label>
        <div style={{ fontSize: 10.5, color: C.textMuted }}>3 reminders</div>
      </div>
      <div className="nf-card" style={{ border: `1px solid ${C.border}`, borderRadius: 8, background: '#fff', padding: 12 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <ReminderRow value="7" unit="Days" first />
          <ReminderRow value="3" unit="Days" />
          <ReminderRow value="1" unit="Day" />
          <div style={{ height: 1, background: C.border, margin: '2px 0' }} />
          <Btn variant="subtle" icon="plus" size="sm" style={{ justifyContent: 'center' }}>
            Add reminder
          </Btn>
        </div>
      </div>
      <div style={{ fontSize: 10.5, color: C.textLight, marginTop: 6, display: 'flex', gap: 5, alignItems: 'flex-start' }}>
        <div style={{ paddingTop: 1 }}><Icon name="info" size={11} color={C.textLight} /></div>
        <div>Reminders stop once the task is marked complete.</div>
      </div>
    </div>

    <TemplateEditor
      subject="Reminder: {{task_name}} due in {{time_remaining}}"
      body={`Hi {{first_name}},\n\nThis is a reminder that "{{task_name}}" is due on {{due_date}} ({{time_remaining}} left).`}
      vars={['first_name', 'task_name', 'due_date', 'time_remaining']}
    />
  </SlideOver>
);

// ------- Scene: main + slide-over side-by-side ---------------------------

const Scene = ({ which }) => {
  // configured summaries shown on the main modal's notification rows
  const configured = {
    invitations: which === 'invitations' ? null : 'Email, SMS · Immediate · 3 recipient groups',
    completion: which === 'completion' ? null : 'Email · Instant notification',
    reminders: which === 'reminders' ? null : 'Email, SMS · 3 reminders (7d, 3d, 1d)',
  };
  // For the "active" one, we DO show the configured summary as well, but the
  // slide-over is open on top editing it.
  const configuredWithActive = {
    ...configured,
    [which]: { invitations: 'Email, SMS · Immediate · 3 recipient groups', completion: 'Email · Instant notification', reminders: 'Email, SMS · 3 reminders (7d, 3d, 1d)' }[which],
  };

  const panel = { invitations: <InvitationsPanel />, completion: <CompletionPanel />, reminders: <RemindersPanel /> }[which];

  return (
    <div style={{
      width: '100%', height: '100%',
      background: C.pageBg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, gap: 20,
      boxSizing: 'border-box',
      overflow: 'hidden',
    }}>
      <SketchyFilter />
      <div style={{ opacity: 0.92, transform: 'scale(.98)' }}>
        <MainModal activeNotif={which} configured={configuredWithActive} />
      </div>
      {panel}
    </div>
  );
};

// ------- Sketchy tweak ---------------------------------------------------

function useSketchyTweak() {
  const [sketchy, setSketchy] = React.useState(false);

  React.useEffect(() => {
    // inject stylesheet once
    if (!document.getElementById('sketchy-style')) {
      const s = document.createElement('style');
      s.id = 'sketchy-style';
      s.textContent = SKETCHY_CSS;
      document.head.appendChild(s);
    }
    // kalam font
    if (!document.getElementById('kalam-font')) {
      const l = document.createElement('link');
      l.id = 'kalam-font';
      l.rel = 'stylesheet';
      l.href = 'https://fonts.googleapis.com/css2?family=Kalam:wght@400;700&display=swap';
      document.head.appendChild(l);
    }
  }, []);

  React.useEffect(() => {
    document.body.classList.toggle('sketchy-on', sketchy);
  }, [sketchy]);

  return [sketchy, setSketchy];
}

function TweaksPanel({ sketchy, setSketchy, visible }) {
  if (!visible) return null;
  return (
    <div style={{
      position: 'fixed', bottom: 20, right: 20, zIndex: 50,
      background: '#1f2937', color: '#fff', borderRadius: 10,
      padding: 14, fontFamily: 'Inter, sans-serif', fontSize: 12,
      boxShadow: '0 10px 40px rgba(0,0,0,.3)', minWidth: 220,
    }}>
      <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', opacity: .6, marginBottom: 10 }}>Tweaks</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Toggle on={sketchy} color="#a78bfa" />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600 }}>Sketchy mode</div>
          <div style={{ fontSize: 10.5, opacity: .6 }}>{sketchy ? 'Hand-drawn feel' : 'Clean mid-fi'}</div>
        </div>
        <button onClick={() => setSketchy(!sketchy)} style={{ border: '1px solid rgba(255,255,255,.2)', background: 'transparent', color: '#fff', padding: '4px 10px', borderRadius: 999, fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}>
          {sketchy ? 'Off' : 'On'}
        </button>
      </div>
    </div>
  );
}

// ------- App -------------------------------------------------------------

function App() {
  const [sketchy, setSketchy] = useSketchyTweak();
  const [tweaksVisible, setTweaksVisible] = React.useState(false);

  React.useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === '__activate_edit_mode') setTweaksVisible(true);
      if (e.data?.type === '__deactivate_edit_mode') setTweaksVisible(false);
    };
    window.addEventListener('message', handler);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', handler);
  }, []);

  return (
    <>
      <TweaksPanel sketchy={sketchy} setSketchy={setSketchy} visible={tweaksVisible} />
      <DesignCanvas>
        <DCSection id="notifs" title="Notifications — slide-over panels"
          subtitle="Click Setup Now on any notification to open its config slide-over. Email & SMS are independent toggles.">
          <DCArtboard id="invitations" label="01 · Invitations" width={920} height={820}>
            <Scene which="invitations" />
          </DCArtboard>
          <DCArtboard id="completion" label="02 · Completion" width={920} height={820}>
            <Scene which="completion" />
          </DCArtboard>
          <DCArtboard id="reminders" label="03 · Reminders" width={920} height={820}>
            <Scene which="reminders" />
          </DCArtboard>
        </DCSection>
      </DesignCanvas>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
