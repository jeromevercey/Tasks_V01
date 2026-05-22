// Interactive prototype — Add Schedule modal with NESTED Notifications config
// 700px modal. Clicking "Setup Now" navigates INTO the modal (same container),
// with a Back button to return to the main view. Toggles, recipients,
// reminders, templates are all stateful.

const C = {
  pageBg: '#4a5362',
  text: '#0f1729',
  textMuted: '#64748b',
  textLight: '#94a3b8',
  border: '#e2e8f0',
  sectionBg: '#f8fafc',
  blue: '#2563eb',
  blueLight: '#eff6ff',
  blueSoft: '#dbeafe',
  danger: '#ef4444',
  green: '#16a34a',
};

const MODAL_W = 700;

// ----- Icons -------------------------------------------------------------
const Icon = ({ name, size = 16, color = 'currentColor', sw = 1.8 }) => {
  const p = {
    close: <path d="M4 4l12 12M16 4L4 16" />,
    calendar: <><rect x="3" y="4" width="14" height="13" rx="2" /><path d="M3 8h14M7 2v4M13 2v4" /></>,
    bell: <><path d="M5 8a5 5 0 0110 0v3l1.5 3h-13L5 11V8z" /><path d="M8 16a2 2 0 004 0" /></>,
    mail: <><rect x="2" y="4" width="16" height="12" rx="1.5" /><path d="M2 6l8 5 8-5" /></>,
    check2: <><circle cx="10" cy="10" r="7" /><path d="M7 10l2 2 4-4" /></>,
    alarm: <><circle cx="10" cy="11" r="6" /><path d="M10 7v4l2 2M4 5l2-2M16 5l-2-2" /></>,
    plus: <path d="M10 4v12M4 10h12" />,
    chevDown: <path d="M5 8l5 5 5-5" />,
    chevLeft: <path d="M12 5l-5 5 5 5" />,
    sms: <path d="M3 4h14v10H9l-4 3v-3H3V4z" />,
    user: <><circle cx="10" cy="7" r="3" /><path d="M4 17a6 6 0 0112 0" /></>,
    users: <><circle cx="7" cy="7" r="3" /><path d="M2 17a5 5 0 0110 0" /><path d="M13 5a3 3 0 010 6M18 17a5 5 0 00-4-5" /></>,
    trash: <><path d="M4 6h12M8 6V4h4v2M6 6l1 11h6l1-11" /></>,
    edit: <><path d="M14 3l3 3-9 9H5v-3l9-9z" /></>,
    info: <><circle cx="10" cy="10" r="7" /><path d="M10 9v5M10 6.5v.5" /></>,
    launch: <><path d="M3 3h6v2H5v10h10v-4h2v6H3V3z" /><path d="M11 3h6v6l-2-2-5 5-2-2 5-5-2-2z" /></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      {p[name]}
    </svg>
  );
};

// ----- Atoms -------------------------------------------------------------
const Toggle = ({ on, onChange, size = 'md', color = C.blue }) => {
  const w = size === 'sm' ? 30 : 36, h = size === 'sm' ? 17 : 20, d = size === 'sm' ? 13 : 16;
  return (
    <button onClick={(e) => { e.stopPropagation(); onChange && onChange(!on); }}
      style={{ width: w, height: h, borderRadius: h / 2, background: on ? color : '#cbd5e1', position: 'relative', transition: 'background .18s', border: 'none', padding: 0, cursor: 'pointer', flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: 2, left: on ? w - d - 2 : 2, width: d, height: d, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,.15)', transition: 'left .18s' }} />
    </button>
  );
};

const Btn = ({ children, variant = 'default', icon, iconRight, style = {}, size = 'md', onClick, disabled }) => {
  const v = {
    primary: { background: disabled ? '#93c5fd' : C.blue, color: '#fff', border: 'none' },
    default: { background: '#fff', color: C.text, border: `1px solid ${C.border}` },
    ghost: { background: 'transparent', color: C.text, border: 'none' },
    subtle: { background: C.sectionBg, color: C.text, border: `1px solid ${C.border}` },
  };
  const pad = size === 'sm' ? '6px 10px' : '8px 14px';
  const fs = size === 'sm' ? 11.5 : 12.5;
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ padding: pad, borderRadius: 999, fontSize: fs, fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 6, cursor: disabled ? 'not-allowed' : 'pointer', transition: 'filter .15s, background .15s, transform .08s', fontFamily: 'inherit', ...v[variant], ...style }}
      onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(.97)')}
      onMouseUp={(e) => (e.currentTarget.style.transform = '')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = '')}>
      {icon && <Icon name={icon} size={13} />}
      {children}
      {iconRight && <Icon name={iconRight} size={13} />}
    </button>
  );
};

const TextInput = ({ value, onChange, placeholder, style = {}, suffix }) => (
  <div style={{ position: 'relative' }}>
    <input value={value || ''} onChange={(e) => onChange && onChange(e.target.value)} placeholder={placeholder}
      style={{ width: '100%', height: 36, padding: '0 12px', paddingRight: suffix ? 32 : 12, border: `1px solid ${C.border}`, borderRadius: 6, background: '#fff', fontSize: 12.5, color: C.text, fontFamily: 'inherit', outline: 'none', ...style }}
      onFocus={(e) => (e.target.style.borderColor = C.blue)}
      onBlur={(e) => (e.target.style.borderColor = C.border)} />
    {suffix && <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: C.textMuted }}>{suffix}</div>}
  </div>
);

const Label = ({ children, required }) => (
  <div style={{ fontSize: 12.5, fontWeight: 600, color: C.text, marginBottom: 6 }}>
    {children} {required && <span style={{ color: C.danger }}>*</span>}
  </div>
);

const SectionHeader = ({ icon, title }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
    <div style={{ width: 28, height: 28, borderRadius: 999, background: C.blueLight, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.blue }}>
      <Icon name={icon} size={15} />
    </div>
    <div style={{ fontSize: 11, fontWeight: 600, color: C.blue, letterSpacing: 1.2, textTransform: 'uppercase' }}>{title}</div>
  </div>
);

// ----- Notification config defaults --------------------------------------

const DEFAULTS = {
  invitations: {
    enabled: true,
    email: {
      on: true,
      senderName: 'TaskFlow',
      from: 'noreply@org.com',
      replyTo: 'admin@org.com',
      cc: [],
      bcc: ['records@org.com'],
      subject: "You're invited to {{schedule_name}}",
      body: `Hi {{first_name}},\n\nYou've been invited to participate in {{schedule_name}}, starting {{start_date}}. Click below to accept.`,
    },
    sms: {
      on: false, senderId: 'TASKS',
      body: `You're invited to {{schedule_name}}. Tap to accept: {{invite_link}}`,
    },
    recipients: [
      { id: 'r1', name: 'Students', count: 234, role: 'Participant', kind: 'group' },
      { id: 'r2', name: 'Teaching Assistants', count: 12, role: 'Moderator', kind: 'group' },
    ],
    timing: 'immediate',
  },
  completion: {
    enabled: true,
    email: {
      on: true,
      senderName: 'TaskFlow',
      from: 'noreply@org.com',
      replyTo: 'admin@org.com',
      cc: [],
      bcc: [],
      subject: '{{task_name}} has been completed',
      body: `Good news — {{participant_name}} just completed "{{task_name}}" in {{schedule_name}}.\n\nCompleted on {{completion_date}}.`,
    },
    sms: {
      on: false, senderId: 'TASKS',
      body: `✓ {{participant_name}} completed "{{task_name}}" in {{schedule_name}}.`,
    },
  },
  reminders: {
    enabled: true,
    items: [
      {
        id: 'rem1',
        name: 'First reminder',
        enabled: true,
        start: { mode: 'relative', fixed: '', time: '09:00', offset: 7, unit: 'Days', when: 'before', anchor: 'due_date' },
        end:   { mode: 'relative', fixed: '', time: '09:00', offset: 1, unit: 'Days', when: 'before', anchor: 'due_date' },
        endEnabled: false,
        repeat: { enabled: false, every: 1, unit: 'Days' },
        email: {
          on: true,
          senderName: 'TaskFlow',
          from: 'noreply@org.com',
          replyTo: 'admin@org.com',
          cc: [],
          bcc: [],
          subject: 'Reminder: {{task_name}} due in {{time_remaining}}',
          body: `Hi {{first_name}},\n\nThis is a reminder that "{{task_name}}" is due on {{due_date}} ({{time_remaining}} left).`,
        },
        sms: {
          on: true, senderId: 'TASKS',
          body: `Reminder: "{{task_name}}" due {{due_date}} ({{time_remaining}} left).`,
        },
      },
      {
        id: 'rem2',
        name: 'Final reminder',
        enabled: true,
        start: { mode: 'relative', fixed: '', time: '09:00', offset: 1, unit: 'Days', when: 'before', anchor: 'due_date' },
        end:   { mode: 'relative', fixed: '', time: '17:00', offset: 0, unit: 'Hours', when: 'before', anchor: 'due_date' },
        endEnabled: false,
        repeat: { enabled: false, every: 1, unit: 'Days' },
        email: {
          on: true,
          senderName: 'TaskFlow',
          from: 'noreply@org.com',
          replyTo: 'admin@org.com',
          cc: [],
          bcc: [],
          subject: 'Final reminder: {{task_name}} is due today',
          body: `Hi {{first_name}},\n\n"{{task_name}}" is due today. Don't forget to complete it!`,
        },
        sms: {
          on: true, senderId: 'TASKS',
          body: `Final reminder: "{{task_name}}" is due today.`,
        },
      },
    ],
  },
};

const REMINDER_DEFAULT = () => ({
  id: 'rem' + Date.now(),
  name: 'New reminder',
  enabled: true,
  start: { mode: 'relative', fixed: '', time: '09:00', offset: 1, unit: 'Days', when: 'before', anchor: 'due_date' },
  end:   { mode: 'relative', fixed: '', time: '09:00', offset: 0, unit: 'Hours', when: 'before', anchor: 'due_date' },
  endEnabled: false,
  repeat: { enabled: false, every: 1, unit: 'Days' },
  email: {
    on: true,
    senderName: 'TaskFlow',
    from: 'noreply@org.com',
    replyTo: 'admin@org.com',
    cc: [],
    bcc: [],
    subject: 'Reminder: {{task_name}}',
    body: `Hi {{first_name}},\n\nThis is a reminder about "{{task_name}}".`,
  },
  sms: {
    on: false, senderId: 'TASKS',
    body: `Reminder: "{{task_name}}" — {{time_remaining}} left.`,
  },
});

const META = {
  invitations: { icon: 'mail', title: 'Invitations', desc: 'Send notifications when users are invited to participate' },
  completion: { icon: 'check2', title: 'Completion', desc: 'Send notifications when tasks are completed' },
  reminders: { icon: 'alarm', title: 'Reminders', desc: 'Send notifications before deadlines' },
};

function summaryFor(kind, cfg) {
  if (!cfg || !cfg.enabled) return null;
  if (kind === 'reminders') {
    const items = (cfg.items || []).filter((r) => r.enabled);
    if (items.length === 0) return null;
    const channels = new Set();
    items.forEach((r) => { if (r.email?.on) channels.add('Email'); if (r.sms?.on) channels.add('SMS'); });
    if (channels.size === 0) return null;
    return `${[...channels].join(', ')} · ${items.length} reminder${items.length === 1 ? '' : 's'}`;
  }
  const ch = [];
  if (cfg.email?.on) ch.push('Email');
  if (cfg.sms?.on) ch.push('SMS');
  if (ch.length === 0) return null;
  if (kind === 'invitations') {
    const r = cfg.recipients?.length || 0;
    return `${ch.join(', ')} · ${cfg.timing === 'immediate' ? 'Immediate' : 'Scheduled'} · ${r} recipient group${r === 1 ? '' : 's'}`;
  }
  if (kind === 'completion') return `${ch.join(', ')} · Instant notification`;
  return ch.join(', ');
}

// ----- Shared: unified Channel + Template config ------------------------

// Small reusable bits
const FieldLabel = ({ children, hint }) => (
  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
    <span style={{ fontSize: 10.5, color: C.textMuted, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.4 }}>{children}</span>
    {hint && <span style={{ fontSize: 10.5, color: C.textLight }}>{hint}</span>}
  </div>
);

const FlatInput = (props) => (
  <input {...props}
    style={{ width: '100%', height: 30, padding: '0 10px', fontSize: 12, color: C.text, border: `1px solid ${C.border}`, borderRadius: 6, background: '#fff', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', ...(props.style || {}) }}
    onFocus={(e) => { e.target.style.borderColor = C.blue; e.target.style.boxShadow = `0 0 0 3px ${C.blueLight}`; props.onFocus && props.onFocus(e); }}
    onBlur={(e) => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none'; props.onBlur && props.onBlur(e); }} />
);

// Email-style chip input for CC / BCC. Accepts comma or Enter to add.
const ChipInput = ({ values, onChange, placeholder }) => {
  const [draft, setDraft] = React.useState('');
  const commit = () => {
    const v = draft.trim().replace(/,$/, '').trim();
    if (!v) return;
    if (!values.includes(v)) onChange([...values, v]);
    setDraft('');
  };
  const removeAt = (i) => onChange(values.filter((_, idx) => idx !== i));
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 5, padding: '5px 6px', minHeight: 30, border: `1px solid ${C.border}`, borderRadius: 6, background: '#fff' }}>
      {values.map((v, i) => (
        <span key={v + i} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '2px 4px 2px 8px', background: C.blueLight, color: C.blue, borderRadius: 4, fontSize: 11.5, fontWeight: 500 }}>
          {v}
          <button onClick={() => removeAt(i)} style={{ background: 'none', border: 'none', color: C.blue, cursor: 'pointer', padding: '0 2px', fontSize: 13, lineHeight: 1, opacity: 0.7 }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = 0.7)}>×</button>
        </span>
      ))}
      <input value={draft}
        onChange={(e) => {
          const v = e.target.value;
          if (v.endsWith(',')) { setDraft(v); setTimeout(commit, 0); } else setDraft(v);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') { e.preventDefault(); commit(); }
          if (e.key === 'Backspace' && !draft && values.length) { onChange(values.slice(0, -1)); }
        }}
        onBlur={commit}
        placeholder={values.length === 0 ? placeholder : ''}
        style={{ flex: 1, minWidth: 100, height: 22, border: 'none', outline: 'none', fontSize: 12, fontFamily: 'inherit', background: 'transparent', color: C.text, padding: '0 4px' }} />
    </div>
  );
};

// Collapsible sub-section with summary line when collapsed.
const SubSection = ({ icon, title, summary, children, defaultOpen = false }) => {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div style={{ borderTop: `1px solid ${C.border}` }}>
      <button onClick={() => setOpen(!open)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}>
        <Icon name={icon} size={12} color={C.textMuted} />
        <div style={{ fontSize: 12, fontWeight: 600, color: C.text, minWidth: 88 }}>{title}</div>
        {!open && summary && (
          <div style={{ flex: 1, fontSize: 11.5, color: C.textMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{summary}</div>
        )}
        {open && <div style={{ flex: 1 }} />}
        <span style={{ display: 'inline-flex', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>
          <Icon name="chevDown" size={11} color={C.textLight} sw={2.2} />
        </span>
      </button>
      {open && (
        <div style={{ padding: '0 14px 14px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {children}
        </div>
      )}
    </div>
  );
};

// Live preview rendered as a mini-inbox row.
const EmailPreview = ({ email, sample }) => {
  const fill = (s) => Object.entries(sample).reduce((acc, [k, v]) => acc.split(`{{${k}}}`).join(v), s || '');
  const initials = (email.senderName || email.from || '?').slice(0, 1).toUpperCase();
  return (
    <div style={{ border: `1px solid ${C.border}`, borderRadius: 8, background: '#fff', overflow: 'hidden' }}>
      <div style={{ padding: '8px 12px', background: C.sectionBg, borderBottom: `1px solid ${C.border}`, fontSize: 10.5, color: C.textMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span>Inbox preview</span>
        <span style={{ fontSize: 10, color: C.textLight, textTransform: 'none', letterSpacing: 0, fontWeight: 500 }}>Live</span>
      </div>
      <div style={{ padding: 14, display: 'flex', gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: C.blueLight, color: C.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, flexShrink: 0 }}>{initials}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 2 }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: C.text }}>{email.senderName || email.from}</div>
            <div style={{ fontSize: 11, color: C.textLight, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>&lt;{email.from}&gt;</div>
            <div style={{ fontSize: 10.5, color: C.textLight, marginLeft: 'auto' }}>Just now</div>
          </div>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: C.text, marginBottom: 4 }}>{fill(email.subject)}</div>
          <div style={{ fontSize: 11.5, color: C.textMuted, lineHeight: 1.55, whiteSpace: 'pre-wrap' }}>{fill(email.body)}</div>
        </div>
      </div>
    </div>
  );
};

// Variable chip strip
const VarStrip = ({ vars, onInsert, disabled }) => (
  <div style={{ padding: '8px 12px', borderTop: `1px solid ${C.border}`, background: C.sectionBg, display: 'flex', gap: 5, flexWrap: 'wrap', alignItems: 'center' }}>
    <span style={{ fontSize: 10.5, color: C.textLight, fontWeight: 500, marginRight: 4 }}>Insert</span>
    {vars.map((v) => (
      <button key={v} onClick={() => !disabled && onInsert(v)} disabled={disabled}
        style={{ fontSize: 10.5, padding: '2px 7px', borderRadius: 4, background: '#fff', border: `1px solid ${C.border}`, color: C.textMuted, fontFamily: 'ui-monospace, SFMono-Regular, monospace', cursor: disabled ? 'not-allowed' : 'pointer' }}
        onMouseEnter={(e) => { if (!disabled) { e.currentTarget.style.borderColor = C.blue; e.currentTarget.style.color = C.blue; } }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textMuted; }}>
        {`{{${v}}}`}
      </button>
    ))}
  </div>
);

// Unified channel + template config. Replaces ChannelPicker + TemplateEditors.
const ChannelConfig = ({ kind, cfg, set, vars, sample, resetDefaults, idSuffix }) => {
  const email = cfg.email;
  const sms = cfg.sms;
  const setEmail = (patch) => set({ email: { ...email, ...patch } });
  const setSms = (patch) => set({ sms: { ...sms, ...patch } });
  const defaults = resetDefaults || (DEFAULTS[kind] || {});
  const uid = idSuffix || kind;

  const initialTab = email.on ? 'email' : (sms.on ? 'sms' : 'email');
  const [tab, setTab] = React.useState(initialTab);
  React.useEffect(() => {
    if (tab === 'email' && !email.on && sms.on) setTab('sms');
    if (tab === 'sms' && !sms.on && email.on) setTab('email');
  }, [email.on, sms.on, tab]);

  const SMS_LIMIT = 160;
  const smsLen = (sms.body || '').length;
  const overLimit = smsLen > SMS_LIMIT;

  const senderSummary = email.senderName ? `${email.senderName} <${email.from}>` : email.from;
  const recipientsSummary = (() => {
    const parts = [];
    if (email.cc.length) parts.push(`Cc ${email.cc.length}`);
    if (email.bcc.length) parts.push(`Bcc ${email.bcc.length}`);
    return parts.length ? parts.join(' · ') : 'No CC or BCC';
  })();

  const TabBtn = ({ id, label, iconName, on }) => {
    const active = tab === id;
    return (
      <button onClick={() => setTab(id)}
        style={{
          flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          padding: '12px 14px', border: 'none', background: 'transparent',
          color: active ? C.blue : C.textMuted,
          fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
          borderBottom: `2px solid ${active ? C.blue : 'transparent'}`,
          transition: 'color .15s, border-color .15s', fontFamily: 'inherit',
          marginBottom: -1, position: 'relative',
        }}>
        <Icon name={iconName} size={13} />
        <span>{label}</span>
        <span style={{
          width: 6, height: 6, borderRadius: '50%',
          background: on ? '#10b981' : C.border,
          transition: 'background .15s',
        }} />
      </button>
    );
  };

  // Channel toggle card — shown at the top so the user can always enable/disable.
  const ChannelCard = ({ on, onChange, iconName, title, desc }) => (
    <div style={{
      flex: 1,
      border: `1px solid ${on ? C.blueSoft : C.border}`,
      background: on ? C.blueLight : '#fff',
      borderRadius: 8,
      padding: '12px 14px',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      transition: 'background .2s, border-color .2s',
      cursor: 'pointer',
    }}
      onClick={() => onChange(!on)}>
      <div style={{
        width: 32, height: 32, borderRadius: 7,
        background: on ? '#fff' : C.sectionBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: on ? C.blue : C.textMuted,
        flexShrink: 0,
      }}>
        <Icon name={iconName} size={15} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{title}</div>
        <div style={{ fontSize: 11, color: C.textMuted }}>{desc}</div>
      </div>
      <div onClick={(e) => e.stopPropagation()}>
        <Toggle on={on} onChange={onChange} size="sm" />
      </div>
    </div>
  );

  return (
    <div>
      {/* Channels header — always visible so users can toggle on/off */}
      <div style={{ marginBottom: 14 }}>
        <Label>Channels</Label>
        <div style={{ display: 'flex', gap: 10 }}>
          <ChannelCard on={email.on} onChange={(v) => setEmail({ on: v })} iconName="mail" title="Email" desc="Send via email inbox" />
          <ChannelCard on={sms.on} onChange={(v) => setSms({ on: v })} iconName="sms" title="SMS" desc="Send via text message" />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <Label>Configuration</Label>
        <span style={{ fontSize: 10.5, color: C.textLight }}>Per channel</span>
      </div>
      <div style={{ border: `1px solid ${C.border}`, borderRadius: 8, background: '#fff', overflow: 'hidden' }}>
        {/* Tab strip */}
        <div style={{ display: 'flex', borderBottom: `1px solid ${C.border}`, background: C.sectionBg }}>
          <TabBtn id="email" label="Email" iconName="mail" on={email.on} />
          <TabBtn id="sms" label="SMS" iconName="sms" on={sms.on} />
        </div>

        {/* Email tab */}
        {tab === 'email' && (
          <div>
            {!email.on ? (
              <div style={{ padding: 28, textAlign: 'center' }}>
                <div style={{ fontSize: 13, color: C.text, fontWeight: 600, marginBottom: 4 }}>Email delivery is off</div>
                <div style={{ fontSize: 11.5, color: C.textMuted, marginBottom: 12 }}>Turn it on to configure the message and recipients.</div>
                <Btn variant="primary" size="sm" onClick={() => setEmail({ on: true })}>Enable email</Btn>
              </div>
            ) : (
              <>
                {/* Sender (collapsible) */}
                <SubSection icon="user" title="Sender" summary={senderSummary}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div>
                      <FieldLabel>Sender name</FieldLabel>
                      <FlatInput value={email.senderName || ''} onChange={(e) => setEmail({ senderName: e.target.value })} placeholder="TaskFlow" />
                    </div>
                    <div>
                      <FieldLabel>Sender email</FieldLabel>
                      <FlatInput value={email.from} onChange={(e) => setEmail({ from: e.target.value })} placeholder="noreply@org.com" />
                    </div>
                  </div>
                  <div>
                    <FieldLabel hint="Replies will be routed here">Reply-to</FieldLabel>
                    <FlatInput value={email.replyTo} onChange={(e) => setEmail({ replyTo: e.target.value })} placeholder="admin@org.com" />
                  </div>
                </SubSection>

                {/* Recipients (collapsible) */}
                <SubSection icon="users" title="CC & BCC" summary={recipientsSummary}>
                  <div>
                    <FieldLabel hint="Visible to all recipients">CC</FieldLabel>
                    <ChipInput values={email.cc} onChange={(v) => setEmail({ cc: v })} placeholder="email@org.com, …" />
                  </div>
                  <div>
                    <FieldLabel hint="Hidden from other recipients">BCC</FieldLabel>
                    <ChipInput values={email.bcc} onChange={(v) => setEmail({ bcc: v })} placeholder="email@org.com, …" />
                  </div>
                </SubSection>

                {/* Message (always open) */}
                <div style={{ borderTop: `1px solid ${C.border}` }}>
                  <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Icon name="edit" size={12} color={C.textMuted} />
                    <div style={{ fontSize: 12, fontWeight: 600, color: C.text, flex: 1 }}>Message</div>
                    <button onClick={() => setEmail({ subject: defaults.email?.subject || '', body: defaults.email?.body || '' })}
                      style={{ fontSize: 10.5, color: C.blue, fontWeight: 500, cursor: 'pointer', background: 'none', border: 'none', padding: 0, fontFamily: 'inherit' }}>Reset</button>
                  </div>
                  <div style={{ padding: '0 14px 4px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 10.5, color: C.textMuted, fontWeight: 500, minWidth: 56 }}>SUBJECT</span>
                    <input value={email.subject || ''} onChange={(e) => setEmail({ subject: e.target.value })}
                      style={{ flex: 1, fontSize: 12.5, color: C.text, border: 'none', outline: 'none', fontFamily: 'inherit', padding: '6px 0', background: 'transparent', borderBottom: `1px solid ${C.border}` }} />
                  </div>
                  <textarea value={email.body || ''} onChange={(e) => setEmail({ body: e.target.value })}
                    placeholder="Write the email body…"
                    id={`email-body-${uid}`}
                    style={{ width: '100%', padding: '12px 14px', fontSize: 12, lineHeight: 1.6, color: C.text, border: 'none', outline: 'none', fontFamily: 'inherit', minHeight: 110, resize: 'vertical', boxSizing: 'border-box', background: 'transparent' }} />
                  <VarStrip vars={vars} onInsert={(v) => {
                    const ta = document.getElementById(`email-body-${uid}`);
                    const ins = ` {{${v}}}`;
                    if (ta && document.activeElement === ta) {
                      const s = ta.selectionStart, e = ta.selectionEnd;
                      const next = (email.body || '').slice(0, s) + ins + (email.body || '').slice(e);
                      setEmail({ body: next });
                      setTimeout(() => { ta.focus(); ta.selectionStart = ta.selectionEnd = s + ins.length; }, 0);
                    } else {
                      setEmail({ body: (email.body || '') + ins });
                    }
                  }} />
                </div>

                {/* Live preview */}
                <div style={{ borderTop: `1px solid ${C.border}`, padding: 14, background: C.sectionBg }}>
                  <EmailPreview email={email} sample={sample} />
                </div>
              </>
            )}
          </div>
        )}

        {/* SMS tab */}
        {tab === 'sms' && (
          <div>
            {!sms.on ? (
              <div style={{ padding: 28, textAlign: 'center' }}>
                <div style={{ fontSize: 13, color: C.text, fontWeight: 600, marginBottom: 4 }}>SMS delivery is off</div>
                <div style={{ fontSize: 11.5, color: C.textMuted, marginBottom: 12 }}>Turn it on to configure the text message.</div>
                <Btn variant="primary" size="sm" onClick={() => setSms({ on: true })}>Enable SMS</Btn>
              </div>
            ) : (
              <>
                <SubSection icon="user" title="Sender ID" summary={sms.senderId || 'TASKS'}>
                  <div>
                    <FieldLabel hint="Up to 11 chars, shown as the sender">Sender ID</FieldLabel>
                    <FlatInput value={sms.senderId || ''} onChange={(e) => setSms({ senderId: e.target.value.slice(0, 11) })} placeholder="TASKS" />
                  </div>
                </SubSection>
                <div style={{ borderTop: `1px solid ${C.border}` }}>
                  <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Icon name="edit" size={12} color={C.textMuted} />
                    <div style={{ fontSize: 12, fontWeight: 600, color: C.text, flex: 1 }}>Message</div>
                    <span style={{ fontSize: 10.5, color: overLimit ? C.danger : C.textLight, fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>{smsLen}/{SMS_LIMIT}</span>
                    <button onClick={() => setSms({ body: defaults.sms?.body || '' })}
                      style={{ fontSize: 10.5, color: C.blue, fontWeight: 500, cursor: 'pointer', background: 'none', border: 'none', padding: 0, fontFamily: 'inherit' }}>Reset</button>
                  </div>
                  <textarea value={sms.body || ''} onChange={(e) => setSms({ body: e.target.value })}
                    placeholder="SMS message (keep it short)…"
                    id={`sms-body-${uid}`}
                    style={{ width: '100%', padding: '12px 14px', fontSize: 12, lineHeight: 1.6, color: C.text, border: 'none', outline: 'none', fontFamily: 'inherit', minHeight: 80, resize: 'vertical', boxSizing: 'border-box', background: 'transparent' }} />
                  <VarStrip vars={vars} onInsert={(v) => {
                    const ta = document.getElementById(`sms-body-${uid}`);
                    const ins = ` {{${v}}}`;
                    if (ta && document.activeElement === ta) {
                      const s = ta.selectionStart, e = ta.selectionEnd;
                      const next = (sms.body || '').slice(0, s) + ins + (sms.body || '').slice(e);
                      setSms({ body: next });
                      setTimeout(() => { ta.focus(); ta.selectionStart = ta.selectionEnd = s + ins.length; }, 0);
                    } else {
                      setSms({ body: (sms.body || '') + ins });
                    }
                  }} />
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ----- Date configuration: fixed or relative ----------------------------

const ANCHORS = {
  start: [
    { id: 'launch_date', label: 'Launch date' },
    { id: 'today', label: 'Today' },
    { id: 'enrollment_open', label: 'Enrollment opens' },
  ],
  end: [
    { id: 'start_date', label: 'Start date' },
    { id: 'launch_date', label: 'Launch date' },
    { id: 'today', label: 'Today' },
  ],
  reminder: [
    { id: 'due_date', label: 'Due date' },
    { id: 'start_date', label: 'Start date' },
    { id: 'end_date', label: 'End date' },
    { id: 'launch_date', label: 'Launch date' },
  ],
};

function DateField({ label, date, onChange, kind, compact = false }) {
  const fixed = date.mode === 'fixed';
  const anchors = ANCHORS[kind] || ANCHORS.start;
  const anchor = anchors.find((a) => a.id === date.anchor) || anchors[0];
  const time = date.time || '09:00';

  const seg = (id, text) => {
    const on = date.mode === id;
    return (
      <button onClick={() => onChange({ ...date, mode: id })}
        style={{ flex: 1, padding: '6px 10px', fontSize: 11.5, fontWeight: 600,
          background: on ? '#fff' : 'transparent',
          color: on ? C.blue : C.textMuted,
          border: 'none', cursor: 'pointer', fontFamily: 'inherit',
          borderRadius: 5,
          boxShadow: on ? '0 1px 2px rgba(15,23,41,.08)' : 'none',
          transition: 'background .15s, color .15s' }}>
        {text}
      </button>
    );
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <div style={{ fontSize: 11.5, color: C.textMuted, fontWeight: 600 }}>{label}</div>
        <div style={{ display: 'flex', gap: 0, padding: 2, background: C.sectionBg, borderRadius: 6, border: `1px solid ${C.border}` }}>
          {seg('fixed', 'Fixed')}
          {seg('relative', 'Relative')}
        </div>
      </div>
      {fixed ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 130px', gap: 8 }}>
          <TextInput value={date.fixed} onChange={(v) => onChange({ ...date, fixed: v })}
            placeholder="yyyy-mm-dd" suffix={<Icon name="calendar" size={13} />} />
          <input type="time" value={time} onChange={(e) => onChange({ ...date, time: e.target.value })}
            style={{ height: 36, padding: '0 10px', border: `1px solid ${C.border}`, borderRadius: 6, background: '#fff', fontSize: 12.5, color: C.text, fontFamily: 'inherit', outline: 'none' }} />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr 1fr', gap: 6 }}>
            <input type="number" min="0" value={date.offset}
              onChange={(e) => onChange({ ...date, offset: Math.max(0, parseInt(e.target.value) || 0) })}
              style={{ height: 36, padding: '0 10px', border: `1px solid ${C.border}`, borderRadius: 6, fontSize: 12.5, color: C.text, fontFamily: 'inherit', outline: 'none', background: '#fff', textAlign: 'center' }} />
            <select value={date.unit} onChange={(e) => onChange({ ...date, unit: e.target.value })}
              style={{ height: 36, padding: '0 10px', border: `1px solid ${C.border}`, borderRadius: 6, background: '#fff', fontSize: 12.5, color: C.text, fontFamily: 'inherit', outline: 'none', cursor: 'pointer' }}>
              {['Hours','Days','Weeks','Months'].map((u) => <option key={u}>{u}</option>)}
            </select>
            <select value={date.when} onChange={(e) => onChange({ ...date, when: e.target.value })}
              style={{ height: 36, padding: '0 10px', border: `1px solid ${C.border}`, borderRadius: 6, background: '#fff', fontSize: 12.5, color: C.text, fontFamily: 'inherit', outline: 'none', cursor: 'pointer' }}>
              <option value="before">before</option>
              <option value="after">after</option>
              <option value="on">on</option>
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 130px', gap: 6 }}>
            <select value={date.anchor} onChange={(e) => onChange({ ...date, anchor: e.target.value })}
              style={{ height: 36, padding: '0 10px', border: `1px solid ${C.border}`, borderRadius: 6, background: '#fff', fontSize: 12.5, color: C.text, fontFamily: 'inherit', outline: 'none', cursor: 'pointer' }}>
              {anchors.map((a) => <option key={a.id} value={a.id}>{a.label}</option>)}
            </select>
            <input type="time" value={time} onChange={(e) => onChange({ ...date, time: e.target.value })}
              style={{ height: 36, padding: '0 10px', border: `1px solid ${C.border}`, borderRadius: 6, background: '#fff', fontSize: 12.5, color: C.text, fontFamily: 'inherit', outline: 'none' }} />
          </div>
          <div style={{ fontSize: 10.5, color: C.textLight, padding: '2px 4px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon name="info" size={11} color={C.textLight} sw={1.6} />
            <span>{date.offset} {date.unit?.toLowerCase()} {date.when} {anchor.label.toLowerCase()} at {time}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ----- Per-notification config bodies (no chrome) ------------------------

function InvitationsBody({ cfg, set }) {
  const [roleInput, setRoleInput] = React.useState('');
  const addRecipient = () => {
    const name = roleInput.trim();
    if (!name) return;
    set({ recipients: [...cfg.recipients, { id: 'r' + Date.now(), name, count: 1, role: 'Participant', kind: 'group' }] });
    setRoleInput('');
  };
  const removeRecipient = (id) => set({ recipients: cfg.recipients.filter((r) => r.id !== id) });

  return (
    <>
      <div>
        <Label>Recipients</Label>
        <div style={{ border: `1px solid ${C.border}`, borderRadius: 8, background: '#fff', padding: 10 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {cfg.recipients.map((r) => (
              <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', background: C.sectionBg, borderRadius: 6 }}>
                <div style={{ width: 26, height: 26, borderRadius: r.kind === 'user' ? '50%' : 5, background: r.kind === 'user' ? '#fde68a' : C.blueLight, color: r.kind === 'user' ? '#92400e' : C.blue, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={r.kind === 'user' ? 'user' : 'users'} size={13} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: C.text }}>{r.name}</div>
                  <div style={{ fontSize: 10.5, color: C.textMuted }}>{r.count} {r.count > 1 ? 'members' : 'member'} · {r.role}</div>
                </div>
                <button onClick={() => removeRecipient(r.id)} style={{ color: C.textLight, background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = C.danger)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = C.textLight)}>
                  <Icon name="trash" size={13} />
                </button>
              </div>
            ))}
            <div style={{ display: 'flex', gap: 6, marginTop: 2 }}>
              <TextInput value={roleInput} onChange={setRoleInput} placeholder="Add a role or group name…"
                style={{ height: 32, fontSize: 11.5 }} />
              <Btn variant="subtle" icon="plus" size="sm" onClick={addRecipient} style={{ whiteSpace: 'nowrap' }}>Add</Btn>
            </div>
          </div>
        </div>
      </div>
      <ChannelConfig kind="invitations" cfg={cfg} set={set}
        vars={['first_name', 'schedule_name', 'start_date', 'invite_link']}
        sample={{ first_name: 'Alex', schedule_name: 'Fall Semester 2025', start_date: 'Sep 1, 2025', invite_link: 'https://app.org/invite' }} />
      <div>
        <Label>Send timing</Label>
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            { key: 'immediate', title: 'Immediate', desc: 'When schedule is created' },
            { key: 'scheduled', title: 'Scheduled', desc: 'Pick a specific date' },
          ].map((o) => {
            const on = cfg.timing === o.key;
            return (
              <button key={o.key} onClick={() => set({ timing: o.key })}
                style={{ flex: 1, padding: '10px 14px', border: `${on ? 1.5 : 1}px solid ${on ? C.blue : C.border}`, borderRadius: 6, background: on ? C.blueLight : '#fff', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', transition: 'background .15s, border-color .15s' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: on ? C.blue : C.text }}>{o.title}</div>
                <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{o.desc}</div>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

function CompletionBody({ cfg, set }) {
  return (
    <>
      <ChannelConfig kind="completion" cfg={cfg} set={set}
        vars={['participant_name', 'task_name', 'schedule_name', 'completion_date']}
        sample={{ participant_name: 'Alex Kim', task_name: 'Week 3 Reading', schedule_name: 'Fall Semester 2025', completion_date: 'Oct 12, 2025' }} />
    </>
  );
}

// ----- Reminder card -----------------------------------------------------

function ReminderCard({ idx, reminder, set, onRemove, total }) {
  const [open, setOpen] = React.useState(idx === 0);
  const setField = (patch) => set({ ...reminder, ...patch });

  // summary line
  const summary = (() => {
    const parts = [];
    const d = reminder.start;
    if (d.mode === 'fixed') {
      parts.push(`Starts ${d.fixed || '—'} ${d.time}`);
    } else {
      const a = (ANCHORS.reminder.find((x) => x.id === d.anchor) || ANCHORS.reminder[0]).label.toLowerCase();
      parts.push(`${d.offset}${(d.unit || '')[0].toLowerCase()} ${d.when} ${a}`);
    }
    const ch = [];
    if (reminder.email?.on) ch.push('Email');
    if (reminder.sms?.on) ch.push('SMS');
    if (ch.length) parts.push(ch.join(' + '));
    else parts.push('No channel');
    return parts.join(' · ');
  })();

  return (
    <div style={{
      border: `1px solid ${reminder.enabled ? (open ? C.blueSoft : C.border) : C.border}`,
      borderRadius: 8,
      background: '#fff',
      overflow: 'hidden',
      transition: 'border-color .15s',
      opacity: reminder.enabled ? 1 : 0.6,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: open ? C.sectionBg : '#fff', borderBottom: open ? `1px solid ${C.border}` : 'none', cursor: 'pointer', transition: 'background .15s' }}
        onClick={() => setOpen(!open)}>
        <div style={{ width: 28, height: 28, borderRadius: 6, background: reminder.enabled ? C.blueLight : C.sectionBg, color: reminder.enabled ? C.blue : C.textMuted, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 11.5, fontWeight: 700 }}>
          {idx + 1}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <input value={reminder.name}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => setField({ name: e.target.value })}
            style={{ fontSize: 13, fontWeight: 600, color: C.text, border: 'none', outline: 'none', background: 'transparent', fontFamily: 'inherit', padding: 0, width: '100%', minWidth: 0 }} />
          <div style={{ fontSize: 11, color: C.textMuted, marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{summary}</div>
        </div>
        <div onClick={(e) => e.stopPropagation()}>
          <Toggle on={reminder.enabled} onChange={(v) => setField({ enabled: v })} size="sm" />
        </div>
        {total > 1 && (
          <button onClick={(e) => { e.stopPropagation(); onRemove(); }}
            style={{ color: C.textLight, background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
            onMouseEnter={(e) => (e.currentTarget.style.color = C.danger)}
            onMouseLeave={(e) => (e.currentTarget.style.color = C.textLight)}>
            <Icon name="trash" size={13} />
          </button>
        )}
        <span style={{ display: 'inline-flex', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>
          <Icon name="chevDown" size={12} color={C.textLight} sw={2.2} />
        </span>
      </div>

      {/* Body */}
      {open && (
        <div style={{
          padding: 16,
          display: 'flex', flexDirection: 'column', gap: 18,
          opacity: reminder.enabled ? 1 : 0.5,
          pointerEvents: reminder.enabled ? 'auto' : 'none',
          transition: 'opacity .2s',
        }}>
          {/* Schedule (start + optional end) */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.blue, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 10 }}>When to send</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <DateField label="Start" date={reminder.start} kind="reminder"
                onChange={(d) => setField({ start: d })} />

              {reminder.endEnabled ? (
                <>
                  <DateField label="End (stop sending)" date={reminder.end} kind="reminder"
                    onChange={(d) => setField({ end: d })} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', border: `1px solid ${C.border}`, borderRadius: 6, background: C.sectionBg }}>
                    <Toggle on={reminder.repeat?.enabled} onChange={(v) => setField({ repeat: { ...reminder.repeat, enabled: v } })} size="sm" />
                    <div style={{ fontSize: 12, fontWeight: 500, color: C.text }}>Repeat between start and end</div>
                    {reminder.repeat?.enabled && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto' }}>
                        <span style={{ fontSize: 11.5, color: C.textMuted }}>every</span>
                        <input type="number" min="1" value={reminder.repeat.every}
                          onChange={(e) => setField({ repeat: { ...reminder.repeat, every: Math.max(1, parseInt(e.target.value) || 1) } })}
                          style={{ width: 56, height: 28, padding: '0 8px', border: `1px solid ${C.border}`, borderRadius: 5, background: '#fff', fontSize: 11.5, color: C.text, fontFamily: 'inherit', outline: 'none', textAlign: 'center' }} />
                        <select value={reminder.repeat.unit} onChange={(e) => setField({ repeat: { ...reminder.repeat, unit: e.target.value } })}
                          style={{ height: 28, padding: '0 8px', border: `1px solid ${C.border}`, borderRadius: 5, background: '#fff', fontSize: 11.5, color: C.text, fontFamily: 'inherit', outline: 'none', cursor: 'pointer' }}>
                          <option>Hours</option><option>Days</option><option>Weeks</option>
                        </select>
                      </div>
                    )}
                    <button onClick={() => setField({ endEnabled: false, repeat: { ...reminder.repeat, enabled: false } })}
                      style={{ background: 'none', border: 'none', color: C.textLight, cursor: 'pointer', padding: 4, marginLeft: reminder.repeat?.enabled ? 0 : 'auto' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = C.danger)}
                      onMouseLeave={(e) => (e.currentTarget.style.color = C.textLight)}>
                      <Icon name="close" size={13} />
                    </button>
                  </div>
                </>
              ) : (
                <button onClick={() => setField({ endEnabled: true })}
                  style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 10px', border: `1px dashed ${C.border}`, borderRadius: 6, background: 'transparent', color: C.textMuted, fontSize: 11.5, fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer' }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.blue; e.currentTarget.style.color = C.blue; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textMuted; }}>
                  <Icon name="plus" size={11} sw={2} /> Add end date (recurring reminder)
                </button>
              )}
            </div>
          </div>

          {/* Channels & templates — per-reminder */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.blue, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 10 }}>Message</div>
            <ChannelConfig
              kind="reminders"
              cfg={reminder}
              set={setField}
              vars={['first_name', 'task_name', 'due_date', 'time_remaining']}
              sample={{ first_name: 'Alex', task_name: 'Week 3 Reading', due_date: 'Oct 15, 2025', time_remaining: '3 days' }}
              resetDefaults={REMINDER_DEFAULT()}
              idSuffix={`reminder-${reminder.id}`}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function RemindersBody({ cfg, set }) {
  const items = cfg.items || [];
  const updateItem = (id, next) => set({ items: items.map((r) => (r.id === id ? next : r)) });
  const removeItem = (id) => set({ items: items.filter((r) => r.id !== id) });
  const addItem = () => {
    const next = REMINDER_DEFAULT();
    next.name = `Reminder ${items.length + 1}`;
    set({ items: [...items, next] });
  };

  return (
    <>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <Label>Reminders</Label>
          <div style={{ fontSize: 10.5, color: C.textMuted }}>{items.length} reminder{items.length === 1 ? '' : 's'}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {items.map((r, i) => (
            <ReminderCard key={r.id} idx={i} reminder={r} total={items.length}
              set={(next) => updateItem(r.id, next)}
              onRemove={() => removeItem(r.id)} />
          ))}
          <Btn variant="subtle" icon="plus" size="sm" onClick={addItem} style={{ justifyContent: 'center' }}>Add reminder</Btn>
        </div>
        <div style={{ fontSize: 10.5, color: C.textLight, marginTop: 8, display: 'flex', gap: 5, alignItems: 'flex-start' }}>
          <div style={{ paddingTop: 1 }}><Icon name="info" size={11} color={C.textLight} /></div>
          <div>Each reminder fires on its own schedule. Reminders stop once the task is marked complete.</div>
        </div>
      </div>
    </>
  );
}

// ----- Nested page: notification config ----------------------------------

function NotifPage({ kind, initial, onBack, onSave }) {
  const [cfg, setCfg] = React.useState(initial);
  React.useEffect(() => { setCfg(initial); }, [kind, initial]);
  const dirty = JSON.stringify(cfg) !== JSON.stringify(initial);
  const set = (p) => setCfg({ ...cfg, ...p });
  const meta = META[kind];

  const Body = { invitations: InvitationsBody, completion: CompletionBody, reminders: RemindersBody }[kind];

  return (
    <>
      {/* Breadcrumb / back */}
      <div style={{ padding: '14px 26px 0', display: 'flex', alignItems: 'center', gap: 8, fontSize: 11.5, color: C.textMuted }}>
        <button onClick={onBack}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', padding: '4px 8px 4px 4px', color: C.textMuted, cursor: 'pointer', borderRadius: 6, fontFamily: 'inherit', fontSize: 11.5 }}
          onMouseEnter={(e) => { e.currentTarget.style.background = C.sectionBg; e.currentTarget.style.color = C.text; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.textMuted; }}>
          <Icon name="chevLeft" size={13} />
          <span>Add New Schedule</span>
        </button>
        <span style={{ color: C.textLight }}>/</span>
        <span style={{ color: C.text, fontWeight: 500 }}>{meta.title}</span>
      </div>

      {/* Page header */}
      <div style={{ padding: '14px 26px 18px', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: C.blueLight, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.blue, flexShrink: 0 }}>
            <Icon name={meta.icon} size={19} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: C.text }}>{meta.title}</div>
            <div style={{ fontSize: 12.5, color: C.textMuted, marginTop: 2 }}>{meta.desc}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', border: `1px solid ${cfg.enabled ? C.blueSoft : C.border}`, background: cfg.enabled ? C.blueLight : C.sectionBg, borderRadius: 8, transition: 'background .2s, border-color .2s' }}>
            <div style={{ fontSize: 11.5, fontWeight: 600, color: C.text }}>{cfg.enabled ? 'Enabled' : 'Disabled'}</div>
            <Toggle on={cfg.enabled} onChange={(v) => set({ enabled: v })} size="sm" />
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 26px', display: 'flex', flexDirection: 'column', gap: 22, opacity: cfg.enabled ? 1 : 0.45, pointerEvents: cfg.enabled ? 'auto' : 'none', transition: 'opacity .2s' }}>
        <Body cfg={cfg} set={set} />
      </div>

      {/* Footer */}
      <div style={{ padding: '14px 26px', borderTop: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Btn variant="ghost" icon="chevLeft" onClick={onBack} style={{ color: C.textMuted, padding: '6px 10px 6px 6px' }}>Back</Btn>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {dirty && <span style={{ fontSize: 11, color: C.textMuted }}>Unsaved changes</span>}
          <Btn variant="primary" onClick={() => onSave(cfg)}>Save & Return</Btn>
        </div>
      </div>
    </>
  );
}

// ----- Launch conditions ------------------------------------------------

const DEMO_FIELDS = [
  { id: 'role',       label: 'Role',       options: ['Student', 'TA', 'Instructor', 'Admin', 'Observer'] },
  { id: 'group',      label: 'Group',      options: ['Cohort A', 'Cohort B', 'Pilot', 'Beta testers'] },
  { id: 'department', label: 'Department', options: ['Math', 'Science', 'Humanities', 'Engineering', 'Arts'] },
  { id: 'location',   label: 'Location',   options: ['North America', 'Europe', 'Asia', 'South America', 'Africa', 'Oceania'] },
  { id: 'language',   label: 'Language',   options: ['English', 'French', 'Spanish', 'German', 'Mandarin', 'Portuguese'] },
  { id: 'age',        label: 'Age range',  options: ['Under 18', '18–24', '25–34', '35–44', '45–54', '55+'] },
  { id: 'tags',       label: 'Tags',       options: ['VIP', 'Returning', 'New', 'High-engagement', 'At-risk'] },
];

const OPERATORS = {
  single: [
    { id: 'is',          label: 'is' },
    { id: 'is_not',      label: 'is not' },
    { id: 'contains',    label: 'contains' },
    { id: 'starts_with', label: 'starts with' },
  ],
  multi:  [{ id: 'is_one_of', label: 'is one of' }],
};

const ALL_OPS = [
  ...OPERATORS.single,
  ...OPERATORS.multi,
];

const opNeedsMulti = (op) => op === 'is_one_of';
const opIsFreeText = (op) => op === 'contains' || op === 'starts_with';

const newDemographicCondition = () => ({
  type: 'demographic', id: 'c' + Date.now() + Math.random().toString(36).slice(2, 5),
  field: 'role', operator: 'is', value: 'Student', values: [],
});
const newDateCondition = () => ({
  type: 'date_range', id: 'c' + Date.now() + Math.random().toString(36).slice(2, 5),
  from: '2025-09-01', to: '2025-12-31',
});
const newGroup = (op = 'AND') => ({
  type: 'group', id: 'g' + Date.now() + Math.random().toString(36).slice(2, 5),
  op, name: '', enabled: true, children: [newDemographicCondition()],
});

// Multi-value chip select for `is_one_of`
const MultiChipSelect = ({ field, values, onChange }) => {
  const fld = DEMO_FIELDS.find((f) => f.id === field) || DEMO_FIELDS[0];
  const remaining = fld.options.filter((o) => !values.includes(o));
  const [pick, setPick] = React.useState('');
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 5, padding: '4px 6px', minHeight: 32, border: `1px solid ${C.border}`, borderRadius: 6, background: '#fff', flex: 1, minWidth: 160 }}>
      {values.map((v) => (
        <span key={v} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '2px 4px 2px 8px', background: C.blueLight, color: C.blue, borderRadius: 4, fontSize: 11.5, fontWeight: 500 }}>
          {v}
          <button onClick={() => onChange(values.filter((x) => x !== v))}
            style={{ background: 'none', border: 'none', color: C.blue, cursor: 'pointer', padding: '0 2px', fontSize: 13, lineHeight: 1, opacity: 0.7 }}>×</button>
        </span>
      ))}
      {remaining.length > 0 && (
        <select value={pick} onChange={(e) => { if (e.target.value) { onChange([...values, e.target.value]); setPick(''); } }}
          style={{ flex: 1, minWidth: 90, height: 24, border: 'none', outline: 'none', fontSize: 11.5, fontFamily: 'inherit', background: 'transparent', color: values.length ? C.textMuted : C.text, cursor: 'pointer' }}>
          <option value="">{values.length === 0 ? 'Pick one or more…' : '+ Add'}</option>
          {remaining.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      )}
    </div>
  );
};

// Single condition row
const ConditionRow = ({ cond, onChange, onRemove }) => {
  const set = (patch) => onChange({ ...cond, ...patch });
  if (cond.type === 'demographic') {
    const fld = DEMO_FIELDS.find((f) => f.id === cond.field) || DEMO_FIELDS[0];
    const op = cond.operator;
    const isMulti = opNeedsMulti(op);
    const isText = opIsFreeText(op);
    const ctlStyle = { height: 32, padding: '0 8px', border: `1px solid ${C.border}`, borderRadius: 6, background: '#fff', fontSize: 11.5, color: C.text, fontFamily: 'inherit', outline: 'none', cursor: 'pointer' };
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', padding: '8px 10px', background: '#fff', border: `1px solid ${C.border}`, borderRadius: 6 }}>
        <span style={{ fontSize: 10, fontWeight: 600, color: C.textMuted, padding: '2px 6px', background: C.sectionBg, borderRadius: 3, textTransform: 'uppercase', letterSpacing: 0.4 }}>User</span>
        <select value={cond.field} onChange={(e) => set({ field: e.target.value, value: '', values: [] })} style={ctlStyle}>
          {DEMO_FIELDS.map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}
        </select>
        <select value={op} onChange={(e) => {
          const next = e.target.value;
          // when switching to a free-text op, clear preset value
          set({ operator: next, value: opIsFreeText(next) ? '' : (cond.value || fld.options[0]), values: opNeedsMulti(next) ? (cond.values?.length ? cond.values : [fld.options[0]]) : [] });
        }} style={ctlStyle}>
          {ALL_OPS.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
        </select>
        {isMulti ? (
          <MultiChipSelect field={cond.field} values={cond.values || []} onChange={(v) => set({ values: v })} />
        ) : isText ? (
          <input value={cond.value || ''} onChange={(e) => set({ value: e.target.value })}
            placeholder={op === 'starts_with' ? `e.g. "Stu"` : `e.g. "Cohort"`}
            style={{ flex: 1, minWidth: 140, height: 32, padding: '0 10px', border: `1px solid ${C.border}`, borderRadius: 6, background: '#fff', fontSize: 11.5, color: C.text, fontFamily: 'inherit', outline: 'none' }} />
        ) : (
          <select value={cond.value || fld.options[0]} onChange={(e) => set({ value: e.target.value })} style={{ ...ctlStyle, flex: 1, minWidth: 140 }}>
            {fld.options.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        )}
        <button onClick={onRemove} style={{ marginLeft: 'auto', color: C.textLight, background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
          onMouseEnter={(e) => (e.currentTarget.style.color = C.danger)}
          onMouseLeave={(e) => (e.currentTarget.style.color = C.textLight)}>
          <Icon name="trash" size={13} />
        </button>
      </div>
    );
  }
  // date_range
  const dateInput = (val, on) => (
    <input type="date" value={val} onChange={(e) => on(e.target.value)}
      style={{ height: 32, padding: '0 8px', border: `1px solid ${C.border}`, borderRadius: 6, background: '#fff', fontSize: 11.5, color: C.text, fontFamily: 'inherit', outline: 'none' }} />
  );
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', padding: '8px 10px', background: '#fff', border: `1px solid ${C.border}`, borderRadius: 6 }}>
      <span style={{ fontSize: 10, fontWeight: 600, color: C.textMuted, padding: '2px 6px', background: C.sectionBg, borderRadius: 3, textTransform: 'uppercase', letterSpacing: 0.4 }}>Date</span>
      <span style={{ fontSize: 11.5, color: C.text, fontWeight: 500 }}>Activity between</span>
      {dateInput(cond.from, (v) => set({ from: v }))}
      <span style={{ fontSize: 11.5, color: C.textMuted }}>and</span>
      {dateInput(cond.to, (v) => set({ to: v }))}
      <button onClick={onRemove} style={{ marginLeft: 'auto', color: C.textLight, background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
        onMouseEnter={(e) => (e.currentTarget.style.color = C.danger)}
        onMouseLeave={(e) => (e.currentTarget.style.color = C.textLight)}>
        <Icon name="trash" size={13} />
      </button>
    </div>
  );
};

// AND / OR pill
const OpPill = ({ op, onChange, disabled }) => {
  const seg = (id, label) => {
    const on = op === id;
    return (
      <button onClick={() => !disabled && onChange(id)} disabled={disabled}
        style={{
          padding: '4px 10px', fontSize: 10.5, fontWeight: 700, letterSpacing: 0.5,
          background: on ? (id === 'AND' ? C.blue : '#7c3aed') : 'transparent',
          color: on ? '#fff' : C.textMuted,
          border: 'none', cursor: disabled ? 'default' : 'pointer', fontFamily: 'inherit',
          borderRadius: 4, transition: 'background .15s, color .15s',
        }}>
        {label}
      </button>
    );
  };
  return (
    <div style={{ display: 'inline-flex', padding: 2, background: C.sectionBg, borderRadius: 6, border: `1px solid ${C.border}` }}>
      {seg('AND', 'AND')}
      {seg('OR', 'OR')}
    </div>
  );
};

// Recursive group renderer
const ConditionGroup = ({ group, depth, onChange, onRemove, isRoot }) => {
  const update = (patch) => onChange({ ...group, ...patch });
  const updateChild = (idx, next) => {
    const children = group.children.slice();
    children[idx] = next;
    update({ children });
  };
  const removeChild = (idx) => update({ children: group.children.filter((_, i) => i !== idx) });
  const addCond = (factory) => update({ children: [...group.children, factory()] });
  const addGroup = () => {
    // child group toggles to opposite operator for natural nesting
    update({ children: [...group.children, newGroup(group.op === 'AND' ? 'OR' : 'AND')] });
  };

  const accent = group.op === 'AND' ? C.blue : '#7c3aed';
  const accentBg = group.op === 'AND' ? C.blueLight : '#f3e8ff';

  const enabled = group.enabled !== false;
  const placeholder = isRoot ? 'Name this condition group (optional)' : 'Nested group name';

  return (
    <div style={{
      position: 'relative',
      padding: 12,
      background: depth % 2 === 0 ? C.sectionBg : '#fff',
      border: `1px solid ${depth === 0 ? C.border : accent + '40'}`,
      borderLeft: depth === 0 ? `1px solid ${C.border}` : `3px solid ${accent}`,
      borderRadius: 8,
      opacity: enabled ? 1 : 0.6,
      transition: 'opacity .18s',
    }}>
      {/* Group header — name + master toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, paddingBottom: 10, borderBottom: `1px dashed ${C.border}` }}>
        <input value={group.name || ''} onChange={(e) => update({ name: e.target.value })}
          placeholder={placeholder}
          style={{ flex: 1, minWidth: 0, fontSize: 13, fontWeight: 600, color: C.text, border: 'none', outline: 'none', background: 'transparent', fontFamily: 'inherit', padding: '2px 0' }} />
        <span style={{ fontSize: 10.5, fontWeight: 600, color: enabled ? C.green : C.textLight, padding: '2px 7px', background: enabled ? '#dcfce7' : C.sectionBg, borderRadius: 3, letterSpacing: 0.4, textTransform: 'uppercase' }}>
          {enabled ? 'On' : 'Off'}
        </span>
        <Toggle on={enabled} onChange={(v) => update({ enabled: v })} size="sm" />
        {!isRoot && (
          <button onClick={onRemove}
            style={{ color: C.textLight, background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'inline-flex', alignItems: 'center' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = C.danger)}
            onMouseLeave={(e) => (e.currentTarget.style.color = C.textLight)}>
            <Icon name="trash" size={13} />
          </button>
        )}
      </div>

      {/* Operator row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, pointerEvents: enabled ? 'auto' : 'none' }}>
        <OpPill op={group.op} onChange={(v) => update({ op: v })} disabled={!enabled} />
        <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 500 }}>
          {group.op === 'AND' ? 'All conditions must match' : 'Any condition can match'}
        </div>
      </div>

      <div style={{ pointerEvents: enabled ? 'auto' : 'none' }}>
        {/* Children with operator separators */}
        {group.children.length === 0 ? (
          <div style={{ fontSize: 11.5, color: C.textMuted, padding: '14px 10px', textAlign: 'center', border: `1px dashed ${C.border}`, borderRadius: 6, background: '#fff' }}>
            Add a condition to get started
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {group.children.map((c, i) => (
              <React.Fragment key={c.id}>
                {i > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 4px' }}>
                    <div style={{ flex: 1, height: 1, background: C.border }} />
                    <span style={{ fontSize: 9.5, fontWeight: 700, color: accent, background: accentBg, padding: '2px 7px', borderRadius: 3, letterSpacing: 0.6 }}>{group.op}</span>
                    <div style={{ flex: 1, height: 1, background: C.border }} />
                  </div>
                )}
                {c.type === 'group' ? (
                  <ConditionGroup group={c} depth={depth + 1}
                    onChange={(next) => updateChild(i, next)}
                    onRemove={() => removeChild(i)} />
                ) : (
                  <ConditionRow cond={c} onChange={(next) => updateChild(i, next)} onRemove={() => removeChild(i)} />
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Add menu */}
        <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
          <Btn variant="default" size="sm" icon="plus" onClick={() => addCond(newDemographicCondition)}>Demographic</Btn>
          <Btn variant="default" size="sm" icon="plus" onClick={() => addCond(newDateCondition)}>Date range</Btn>
          <Btn variant="ghost" size="sm" icon="plus" onClick={addGroup} style={{ color: accent }}>Nested group</Btn>
        </div>
      </div>
    </div>
  );
};

// Top-level entry point on the main page — a row that navigates into a
// nested page, exactly like the notification rows.
const LaunchConditionsRow = ({ value, onClick }) => {
  const count = countConditions(value);
  const has = count > 0;
  return (
    <div onClick={onClick} style={{
      background: has ? '#fff' : C.sectionBg,
      border: `1px solid ${has ? C.blueSoft : C.border}`,
      borderRadius: 8, padding: '14px 16px',
      display: 'flex', alignItems: 'center', gap: 14,
      cursor: 'pointer', transition: 'background .15s, border-color .15s, box-shadow .15s',
    }}
    onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.blue; e.currentTarget.style.boxShadow = `0 0 0 2px ${C.blueLight}`; }}
    onMouseLeave={(e) => { e.currentTarget.style.borderColor = has ? C.blueSoft : C.border; e.currentTarget.style.boxShadow = 'none'; }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: has ? C.blueLight : '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: has ? C.blue : C.textMuted, flexShrink: 0 }}>
        <Icon name="launch" size={15} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: C.text }}>
          {has ? `${count} condition${count === 1 ? '' : 's'} configured` : 'No specific conditions added.'}
        </div>
        <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {has ? summarizeConditions(value) : 'Restrict who this schedule launches for using demographics or date ranges.'}
        </div>
      </div>
      {has ? (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: C.green, background: '#dcfce7', padding: '3px 8px', borderRadius: 999, letterSpacing: 0.3, textTransform: 'uppercase' }}>Active</div>
          <Btn size="sm" variant="ghost" icon="edit" style={{ padding: '5px 8px', color: C.textMuted }}>Edit</Btn>
        </div>
      ) : (
        <Btn size="sm" icon="plus">Setup Now</Btn>
      )}
    </div>
  );
};

// Helpers — count + summarize a condition tree for the row.
function countConditions(node) {
  if (!node) return 0;
  if (node.type === 'group') {
    if (node.enabled === false) return 0;
    return (node.children || []).reduce((n, c) => n + countConditions(c), 0);
  }
  return 1;
}
function summarizeConditions(node) {
  if (!node) return '';
  if (node.type !== 'group') return '';
  const types = new Set();
  const walk = (n) => {
    if (!n) return;
    if (n.type === 'group') {
      if (n.enabled === false) return;
      (n.children || []).forEach(walk);
    }
    else if (n.type === 'demographic') types.add('Demographics');
    else if (n.type === 'date_range') types.add('Date range');
  };
  walk(node);
  const prefix = node.name ? `"${node.name}" · ` : '';
  const disabled = node.enabled === false ? ' · Disabled' : '';
  return `${prefix}${[...types].join(' · ')} · joined with ${node.op}${disabled}`;
}

// Nested page for building conditions, with back/save chrome matching NotifPage.
function LaunchPage({ initial, onBack, onSave }) {
  const [val, setVal] = React.useState(initial || newGroup('AND'));
  const dirty = JSON.stringify(val) !== JSON.stringify(initial);
  const count = countConditions(val);

  return (
    <>
      <div style={{ padding: '14px 26px 0', display: 'flex', alignItems: 'center', gap: 8, fontSize: 11.5, color: C.textMuted }}>
        <button onClick={onBack}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', padding: '4px 8px 4px 4px', color: C.textMuted, cursor: 'pointer', borderRadius: 6, fontFamily: 'inherit', fontSize: 11.5 }}
          onMouseEnter={(e) => { e.currentTarget.style.background = C.sectionBg; e.currentTarget.style.color = C.text; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.textMuted; }}>
          <Icon name="chevLeft" size={13} />
          <span>Add New Schedule</span>
        </button>
        <span style={{ color: C.textLight }}>/</span>
        <span style={{ color: C.text, fontWeight: 500 }}>Launch Conditions</span>
      </div>

      <div style={{ padding: '14px 26px 18px', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: C.blueLight, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.blue, flexShrink: 0 }}>
            <Icon name="launch" size={19} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: C.text }}>Launch Conditions</div>
            <div style={{ fontSize: 12.5, color: C.textMuted, marginTop: 2 }}>Build a rule with demographics or date ranges. Group conditions to combine AND / OR.</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', border: `1px solid ${count > 0 ? C.blueSoft : C.border}`, background: count > 0 ? C.blueLight : C.sectionBg, borderRadius: 8 }}>
            <div style={{ fontSize: 11.5, fontWeight: 600, color: C.text }}>{count} condition{count === 1 ? '' : 's'}</div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 26px' }}>
        <ConditionGroup group={val} depth={0} isRoot
          onChange={setVal}
          onRemove={() => setVal(newGroup('AND'))} />
      </div>

      <div style={{ padding: '14px 26px', borderTop: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <Btn variant="ghost" icon="chevLeft" onClick={onBack} style={{ color: C.textMuted, padding: '6px 10px 6px 6px' }}>Back</Btn>
          {initial && (
            <Btn variant="ghost" onClick={() => onSave(null)} style={{ color: C.danger }}>Clear all</Btn>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {dirty && <span style={{ fontSize: 11, color: C.textMuted }}>Unsaved changes</span>}
          <Btn variant="primary" onClick={() => onSave(count > 0 ? val : null)}>Save & Return</Btn>
        </div>
      </div>
    </>
  );
}

// Top-level condition builder section
const LaunchConditions = ({ value, onChange }) => {
  const enabled = !!value;
  if (!enabled) {
    return (
      <div style={{ background: C.sectionBg, border: `1px solid ${C.border}`, borderRadius: 8, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.textMuted }}>
          <Icon name="launch" size={15} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: C.text }}>No specific conditions added.</div>
          <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>Restrict who this schedule launches for using demographics or date ranges.</div>
        </div>
        <Btn size="sm" icon="plus" onClick={() => onChange(newGroup('AND'))}>Add Condition</Btn>
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <ConditionGroup group={value} depth={0} isRoot
        onChange={onChange}
        onRemove={() => onChange(null)} />
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={() => onChange(null)}
          style={{ background: 'none', border: 'none', color: C.textMuted, fontSize: 11, fontFamily: 'inherit', cursor: 'pointer', padding: '4px 8px' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = C.danger)}
          onMouseLeave={(e) => (e.currentTarget.style.color = C.textMuted)}>
          Clear all conditions
        </button>
      </div>
    </div>
  );
};

// ----- Tab summaries ----------------------------------------------------

function describeDate(date) {
  if (!date) return '—';
  if (date.mode === 'fixed') {
    if (!date.fixed) return '—';
    const d = new Date(date.fixed);
    if (isNaN(d)) return date.fixed;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
  // relative
  const all = [...ANCHORS.start, ...ANCHORS.end];
  const a = (all.find((x) => x.id === date.anchor) || ANCHORS.start[0]).label.toLowerCase();
  const off = date.offset || 0;
  if (off === 0 && date.when === 'on') return `On ${a}`;
  return `${off} ${(date.unit || 'days').toLowerCase()} ${date.when} ${a}`;
}

function infoTabSummary({ scheduleName, priority, dates }) {
  if (!scheduleName) return null;
  const parts = [];
  parts.push(`${describeDate(dates.start)} → ${describeDate(dates.end)}`);
  parts.push(`P${priority}`);
  return parts.join(' · ');
}

function notifTabSummary(configs) {
  const active = ['invitations', 'completion', 'reminders'].filter((k) => configs[k] && summaryFor(k, configs[k]));
  if (active.length === 0) return null;
  return `${active.length}/3 active · ${active.map((k) => META[k].title).join(', ')}`;
}

function launchTabSummary(value) {
  if (!value) return null;
  const c = countConditions(value);
  if (c === 0) return null;
  const types = new Set();
  const walk = (n) => {
    if (!n) return;
    if (n.type === 'group') {
      if (n.enabled === false) return;
      (n.children || []).forEach(walk);
    } else if (n.type === 'demographic') types.add('Demographics');
    else if (n.type === 'date_range') types.add('Date range');
  };
  walk(value);
  const nm = value.name ? `"${value.name}" · ` : '';
  return `${nm}${c} condition${c === 1 ? '' : 's'} · ${[...types].join(' + ') || 'Empty'}`;
}

// ----- Tab stepper ------------------------------------------------------

function TabStepper({ tabs, activeId, onChange, mode, validity }) {
  return (
    <div style={{ display: 'flex', borderBottom: `1px solid ${C.border}`, background: C.sectionBg }}>
      {tabs.map((t, i) => {
        const isActive = t.id === activeId;
        const hasSummary = !!t.summary;
        const showCheck = mode === 'edit' ? hasSummary : !!validity[t.id];
        const showSummary = mode === 'edit' && hasSummary;
        return (
          <button key={t.id} onClick={() => onChange(t.id)}
            style={{
              flex: 1, minWidth: 0,
              display: 'flex', alignItems: 'flex-start', gap: 10,
              padding: '12px 14px',
              background: isActive ? '#fff' : 'transparent',
              border: 'none',
              borderRight: i < tabs.length - 1 ? `1px solid ${C.border}` : 'none',
              borderBottom: `2px solid ${isActive ? C.blue : 'transparent'}`,
              marginBottom: -1,
              cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
              transition: 'background .15s',
            }}
            onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,.55)'; }}
            onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}>
            <div style={{
              width: 22, height: 22, borderRadius: '50%',
              background: isActive ? C.blue : (showCheck ? '#dcfce7' : '#e2e8f0'),
              color: isActive ? '#fff' : (showCheck ? C.green : C.textMuted),
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10.5, fontWeight: 700, flexShrink: 0, marginTop: 1,
              transition: 'background .15s, color .15s',
            }}>
              {showCheck && !isActive ? <Icon name="check2" size={12} sw={2.6} /> : t.step}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <div style={{ fontSize: 9, color: isActive ? C.blue : C.textLight, fontWeight: 700, letterSpacing: 0.7, textTransform: 'uppercase' }}>
                  Step {t.step}
                </div>
                {t.optional && (
                  <div style={{ fontSize: 9, color: C.textLight, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase' }}>· Optional</div>
                )}
              </div>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: isActive ? C.text : C.textMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 1 }}>{t.label}</div>
              {showSummary && (
                <div style={{ fontSize: 10.5, color: C.textMuted, marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.35 }}>{t.summary}</div>
              )}
              {mode === 'edit' && !showSummary && t.optional && (
                <div style={{ fontSize: 10.5, color: C.textLight, marginTop: 3, fontStyle: 'italic' }}>Not configured</div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ----- Mode toggle (Create / Edit) — for demoing both states ------------

function ModeToggle({ mode, onChange }) {
  const seg = (id, label) => {
    const on = mode === id;
    return (
      <button onClick={() => onChange(id)}
        style={{
          padding: '4px 10px', fontSize: 10.5, fontWeight: 600, letterSpacing: 0.3,
          background: on ? '#fff' : 'transparent',
          color: on ? C.text : C.textMuted,
          border: 'none', cursor: 'pointer', fontFamily: 'inherit',
          borderRadius: 4, transition: 'background .15s, color .15s',
          boxShadow: on ? '0 1px 2px rgba(15,23,41,.08)' : 'none',
        }}>
        {label}
      </button>
    );
  };
  return (
    <div style={{ display: 'inline-flex', padding: 2, background: C.sectionBg, borderRadius: 6, border: `1px solid ${C.border}` }}>
      {seg('create', 'Create')}
      {seg('edit', 'Edit')}
    </div>
  );
}

// ----- Main page ---------------------------------------------------------

function MainPage({ configs, openNotif, scheduleName, setScheduleName, priority, setPriority, dates, setDates, launchConditions, openLaunch, onClose, mode, setMode }) {
  const [tab, setTab] = React.useState('info');

  const tabsDef = [
    { id: 'info', step: 1, label: 'Schedule information', summary: infoTabSummary({ scheduleName, priority, dates }) },
    { id: 'notif', step: 2, label: 'Notifications', summary: notifTabSummary(configs) },
    { id: 'launch', step: 3, label: 'Launch conditions', summary: launchTabSummary(launchConditions), optional: true },
  ];
  const validity = {
    info: !!scheduleName,
    notif: !!notifTabSummary(configs),
    launch: !!launchTabSummary(launchConditions),
  };
  const tabIdx = tabsDef.findIndex((t) => t.id === tab);
  const isLast = tabIdx === tabsDef.length - 1;
  const isFirst = tabIdx === 0;

  const notifRow = (id) => {
    const cfg = configs[id];
    const summary = summaryFor(id, cfg);
    const m = META[id];
    return (
      <div onClick={() => openNotif(id)} style={{
        background: summary ? '#fff' : C.sectionBg,
        border: `1px solid ${summary ? C.blueSoft : C.border}`,
        borderRadius: 8, padding: '14px 16px',
        display: 'flex', alignItems: 'center', gap: 14,
        cursor: 'pointer', transition: 'background .15s, border-color .15s, box-shadow .15s',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.blue; e.currentTarget.style.boxShadow = `0 0 0 2px ${C.blueLight}`; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = summary ? C.blueSoft : C.border; e.currentTarget.style.boxShadow = 'none'; }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: summary ? C.blueLight : '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: summary ? C.blue : C.textMuted, flexShrink: 0 }}>
          <Icon name={m.icon} size={15} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: C.text }}>{m.title}</div>
          <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{summary || m.desc}</div>
        </div>
        {summary ? (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: C.green, background: '#dcfce7', padding: '3px 8px', borderRadius: 999, letterSpacing: 0.3, textTransform: 'uppercase' }}>Active</div>
            <Btn size="sm" variant="ghost" icon="edit" style={{ padding: '5px 8px', color: C.textMuted }}>Edit</Btn>
          </div>
        ) : (
          <Btn size="sm" icon="plus">Setup Now</Btn>
        )}
      </div>
    );
  };

  return (
    <>
      <div style={{ padding: '18px 26px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: C.text }}>
          {mode === 'edit' ? 'Edit Schedule' : 'Add New Schedule'}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <ModeToggle mode={mode} onChange={setMode} />
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: C.textMuted, borderRadius: 6 }}>
            <Icon name="close" size={17} />
          </button>
        </div>
      </div>

      <TabStepper tabs={tabsDef} activeId={tab} onChange={setTab} mode={mode} validity={validity} />

      <div style={{ padding: '22px 26px', flex: 1, overflowY: 'auto' }}>
        {tab === 'info' && (
          <div>
            <SectionHeader icon="calendar" title="Schedule Information" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: 14, marginBottom: 16 }}>
              <div>
                <Label required>Schedule name</Label>
                <TextInput value={scheduleName} onChange={setScheduleName} placeholder="e.g., Fall Semester 2025" />
              </div>
              <div>
                <Label required>Priority</Label>
                <select value={priority} onChange={(e) => setPriority(e.target.value)}
                  style={{ width: '100%', height: 36, padding: '0 10px', border: `1px solid ${C.border}`, borderRadius: 6, background: '#fff', fontSize: 12.5, color: C.text, fontFamily: 'inherit', outline: 'none', cursor: 'pointer' }}>
                  {[1,2,3,4,5].map((n) => <option key={n}>{n}</option>)}
                </select>
                <div style={{ fontSize: 10, color: C.textMuted, marginTop: 3 }}>1 = Highest priority</div>
              </div>
            </div>
            <Label required>Schedule Dates</Label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <DateField label="Start date" date={dates.start} onChange={(d) => setDates({ ...dates, start: d })} kind="start" />
              <DateField label="End date"   date={dates.end}   onChange={(d) => setDates({ ...dates, end: d })}   kind="end" />
            </div>
          </div>
        )}

        {tab === 'notif' && (
          <div>
            <SectionHeader icon="bell" title="Notifications" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {notifRow('invitations')}
              {notifRow('completion')}
              {notifRow('reminders')}
            </div>
          </div>
        )}

        {tab === 'launch' && (
          <div>
            <SectionHeader icon="launch" title="Launch Conditions" />
            <LaunchConditionsRow value={launchConditions} onClick={openLaunch} />
          </div>
        )}
      </div>

      <div style={{ padding: '14px 26px', borderTop: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
        <Btn variant="ghost" onClick={onClose} style={{ color: C.textMuted }}>Cancel</Btn>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {!isFirst && (
            <Btn icon="chevLeft" onClick={() => setTab(tabsDef[tabIdx - 1].id)} style={{ paddingLeft: 10 }}>Previous</Btn>
          )}
          {!isLast ? (
            <Btn variant="primary" iconRight="chevDown" onClick={() => setTab(tabsDef[tabIdx + 1].id)} style={{ paddingRight: 10 }}>
              Next: {tabsDef[tabIdx + 1].label}
            </Btn>
          ) : (
            <Btn variant="primary">{mode === 'edit' ? 'Save changes' : 'Create schedule'}</Btn>
          )}
        </div>
      </div>
    </>
  );
}

// ----- Toast -------------------------------------------------------------
function Toast({ message, visible }) {
  return (
    <div style={{
      position: 'fixed', bottom: 30, left: '50%',
      transform: `translateX(-50%) translateY(${visible ? 0 : 20}px)`,
      opacity: visible ? 1 : 0, transition: 'opacity .25s, transform .25s',
      background: '#0f1729', color: '#fff', padding: '10px 16px',
      borderRadius: 999, fontSize: 12.5, fontWeight: 500,
      boxShadow: '0 10px 30px rgba(0,0,0,.3)', zIndex: 100,
      display: 'flex', alignItems: 'center', gap: 8, pointerEvents: 'none',
    }}>
      <div style={{ width: 16, height: 16, borderRadius: 999, background: C.green, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="check2" size={10} color="#fff" sw={2.5} />
      </div>
      {message}
    </div>
  );
}

// ----- App ---------------------------------------------------------------

function App() {
  const [mode, setMode] = React.useState('edit'); // 'create' | 'edit'
  const [configs, setConfigs] = React.useState({
    invitations: { ...DEFAULTS.invitations, enabled: true },
    completion: { ...DEFAULTS.completion, enabled: true },
    reminders: { ...DEFAULTS.reminders, enabled: false },
  });
  const [saved, setSaved] = React.useState({ invitations: true, completion: true, reminders: false });
  const [page, setPage] = React.useState('main'); // 'main' | 'invitations' | 'completion' | 'reminders'
  const [pageDir, setPageDir] = React.useState(0); // +1 forward, -1 back — drives slide direction
  const [toast, setToast] = React.useState(null);

  const [scheduleName, setScheduleName] = React.useState('Fall Semester 2025');
  const [priority, setPriority] = React.useState('1');
  const [dates, setDates] = React.useState({
    start: { mode: 'fixed', fixed: '2025-09-02', time: '09:00', offset: 0, unit: 'Days', when: 'before', anchor: 'launch_date' },
    end:   { mode: 'fixed', fixed: '2025-12-19', time: '17:00', offset: 0, unit: 'Days', when: 'after',  anchor: 'start_date' },
  });
  const [launchConditions, setLaunchConditions] = React.useState({
    type: 'group',
    id: 'g_demo',
    op: 'AND',
    name: 'Undergraduate students',
    enabled: true,
    children: [
      { type: 'demographic', id: 'c1', field: 'role', operator: 'is', value: 'Student', values: [] },
      { type: 'demographic', id: 'c2', field: 'program', operator: 'is_one_of', value: '', values: ['Bachelor'] },
    ],
  });

  const displayConfigs = {
    invitations: saved.invitations ? configs.invitations : null,
    completion: saved.completion ? configs.completion : null,
    reminders: saved.reminders ? configs.reminders : null,
  };

  const openNotif = (id) => {
    if (!saved[id]) {
      setConfigs((c) => ({ ...c, [id]: { ...DEFAULTS[id], enabled: true } }));
    }
    setPageDir(1);
    setPage(id);
  };

  const openLaunch = () => { setPageDir(1); setPage('launch'); };

  const goBack = () => { setPageDir(-1); setPage('main'); };

  const saveLaunch = (val) => {
    setLaunchConditions(val);
    setPageDir(-1);
    setPage('main');
    const n = (function count(node) {
      if (!node) return 0;
      if (node.type === 'group') return (node.children || []).reduce((a, c) => a + count(c), 0);
      return 1;
    })(val);
    setToast(val ? `Launch conditions saved (${n})` : 'Launch conditions cleared');
    setTimeout(() => setToast(null), 2400);
  };

  const saveNotif = (id, cfg) => {
    setConfigs((c) => ({ ...c, [id]: cfg }));
    setSaved((s) => ({ ...s, [id]: cfg.enabled }));
    setPageDir(-1);
    setPage('main');
    const msg = cfg.enabled
      ? `${META[id].title} notifications saved`
      : `${META[id].title} notifications disabled`;
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  };

  React.useEffect(() => {
    const h = (e) => {
      if (e.key === 'Escape' && page !== 'main') goBack();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [page]);

  return (
    <div style={{ position: 'fixed', inset: 0, background: C.pageBg, fontFamily: 'Inter, -apple-system, sans-serif', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, boxSizing: 'border-box' }}>
      {/* Modal */}
      <div style={{
        width: MODAL_W,
        maxWidth: '100%',
        maxHeight: 'calc(100vh - 48px)',
        height: 820,
        background: '#fff',
        borderRadius: 12,
        boxShadow: '0 20px 60px rgba(0,0,0,.25)',
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        position: 'relative',
      }}>
        {/* Page transition container */}
        <PageSwitcher page={page} dir={pageDir}>
          {page === 'main' ? (
            <MainPage
              configs={displayConfigs}
              openNotif={openNotif}
              scheduleName={scheduleName} setScheduleName={setScheduleName}
              priority={priority} setPriority={setPriority}
              dates={dates} setDates={setDates}
              launchConditions={launchConditions} openLaunch={openLaunch}
              onClose={() => {}}
              mode={mode} setMode={setMode}
            />
          ) : page === 'launch' ? (
            <LaunchPage
              initial={launchConditions}
              onBack={goBack}
              onSave={saveLaunch}
            />
          ) : (
            <NotifPage
              kind={page}
              initial={configs[page]}
              onBack={goBack}
              onSave={(cfg) => saveNotif(page, cfg)}
            />
          )}
        </PageSwitcher>
      </div>

      <Toast message={toast || ''} visible={!!toast} />
    </div>
  );
}

// Cross-fade + slight slide between pages. Keyed by `page` so React mounts a
// fresh tree for each page — so scroll position, form focus, and the
// per-page draft state all reset cleanly on navigate.
function PageSwitcher({ page, dir, children }) {
  const [renderKey, setRenderKey] = React.useState(page);
  const [entering, setEntering] = React.useState(false);
  React.useEffect(() => {
    setRenderKey(page);
    setEntering(true);
    const t = requestAnimationFrame(() => setEntering(false));
    return () => cancelAnimationFrame(t);
  }, [page]);

  const tx = entering ? (dir >= 0 ? 16 : -16) : 0;
  return (
    <div key={renderKey}
      style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        transform: `translateX(${tx}px)`, opacity: entering ? 0 : 1,
        transition: 'transform .28s cubic-bezier(.2,.7,.3,1), opacity .2s ease-out',
      }}>
      {children}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
